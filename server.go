package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"reflect"

	"github.com/gorilla/context"
	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
	"github.com/pedrosmv/lunchroulette/router"
	"github.com/pedrosmv/lunchroulette/structs"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Context struct {
	db *mgo.Database
}

func (c *Context) LocationsHandler(w http.ResponseWriter, r *http.Request) {
	repository := structs.DBRepository{c.db.C("locations")}
	locations, err := repository.FindAll()
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/vnd.api+json")
	json.NewEncoder(w).Encode(locations)
}

func (c *Context) LocationHandler(w http.ResponseWriter, r *http.Request) {
	parameters := context.Get(r, "parameters").(httprouter.Params)
	repository := structs.DBRepository{c.db.C("locations")}
	location, err := repository.FindLocation(parameters.ByName("id"))
	if err != nil {
		fmt.Println(err)
	}

	w.Header().Set("Content-Type", "application/vnd.api+json")
	json.NewEncoder(w).Encode(location)
}

func (c *Context) CreateHandler(w http.ResponseWriter, r *http.Request) {
	body := context.Get(r, "body").(*structs.LocationObject)
	repository := structs.DBRepository{c.db.C("locations")}
	err := repository.Create(&body.Object)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/vnd.api+json")
	w.WriteHeader(201)
	json.NewEncoder(w).Encode(body)
}

func (c *Context) UpdateHandler(w http.ResponseWriter, r *http.Request) {
	parameters := context.Get(r, "parameters").(httprouter.Params)
	body := context.Get(r, "body").(*structs.LocationObject)
	body.Object.Id = bson.ObjectIdHex(parameters.ByName("id"))
	repository := structs.DBRepository{c.db.C("locations")}
	err := repository.Update(&body.Object)
	if err != nil {
		fmt.Println(err)
	}

	w.WriteHeader(204)
	w.Write([]byte("\n"))
}

func (c *Context) DeleteHandler(w http.ResponseWriter, r *http.Request) {
	parameters := context.Get(r, "parameters").(httprouter.Params)
	repository := structs.DBRepository{c.db.C("locations")}
	err := repository.Delete(parameters.ByName("id"))
	if err != nil {
		fmt.Println(err)
	}
	w.WriteHeader(204)
	w.Write([]byte("\n"))
}

func recoverHandler(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("panic: %+v", err)
			}
		}()

		next.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
}

func acceptHandler(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Accept") != "application/vnd.api+json" {
			return
		}

		next.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
}

func contentTypeHandler(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Content-Type") != "application/vnd.api+json" {
			return
		}

		next.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
}

func bodyHandler(v interface{}) func(http.Handler) http.Handler {
	t := reflect.TypeOf(v)

	m := func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			val := reflect.New(t).Interface()
			err := json.NewDecoder(r.Body).Decode(val)

			if err != nil {
				fmt.Println(err)
			}

			if next != nil {
				context.Set(r, "body", val)
				next.ServeHTTP(w, r)
			}
		}

		return http.HandlerFunc(fn)
	}

	return m
}

func main() {
	session, err := mgo.Dial("localhost")
	if err != nil {
		fmt.Println(err)
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)

	contxt := Context{session.DB("lunchroulette")}
	handlers := alice.New(recoverHandler, acceptHandler)
	router := router.NewRouter()

	router.Get("/locations/:id", handlers.ThenFunc(contxt.LocationHandler))
	router.Put("/locations/:id", handlers.Append(contentTypeHandler, bodyHandler(structs.LocationObject{})).ThenFunc(contxt.UpdateHandler))
	router.Delete("/locations/:id", handlers.ThenFunc(contxt.DeleteHandler))
	router.Get("/locations", handlers.ThenFunc(contxt.LocationsHandler))
	router.Post("/locations", handlers.Append(contentTypeHandler, bodyHandler(structs.LocationObject{})).ThenFunc(contxt.CreateHandler))
	http.ListenAndServe(":8080", nil)
}
