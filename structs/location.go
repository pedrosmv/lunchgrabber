package structs

import (
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Location struct {
	Id      bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	City    string        `json:"city"`
	Country string        `json:"country"`
	Street  string        `json:"street"`
	Number  int           `json:"number"`
}

type LocationList struct {
	List []Location `json:"location_list"`
}

type LocationObject struct {
	Object Location `json:"location_object"`
}

type DBRepository struct {
	Collection *mgo.Collection
}

func (l *DBRepository) FindAll() (LocationList, error) {
	searchResult := LocationList{[]Location{}}

	err := l.Collection.Find(nil).All(&searchResult.List)
	if err != nil {
		return searchResult, err
	}
	return searchResult, nil
}

func (l *DBRepository) FindLocation(id string) (LocationObject, error) {
	searchResult := LocationObject{}
	err := l.Collection.FindId(bson.ObjectIdHex(id)).One(&searchResult)
	if err != nil {
		return searchResult, err
	}

	return searchResult, nil
}

func (l *DBRepository) Create(location *Location) error {
	id := bson.NewObjectId()
	_, err := l.Collection.UpsertId(id, location)
	if err != nil {
		return err
	}

	location.Id = id

	return nil
}

func (l *DBRepository) Update(location *Location) error {
	err := l.Collection.UpdateId(location.Id, location)
	if err != nil {
		return err
	}

	return nil
}

func (l *DBRepository) Delete(id string) error {
	err := l.Collection.RemoveId(bson.ObjectIdHex(id))
	if err != nil {
		return err
	}
	return nil
}
