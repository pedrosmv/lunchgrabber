package methods

import (
	"github.com/pedrosmv/lunchroulette/structs"
)

type Repo struct {
	*structs.DBRepository
}

func (l *Repo) FindAll() (structs.LocationList, error) {
	searchresult := structs.LocationList{[]structs.Location{}}

	err := l
}
