package database

import (
	"log"
	"time"

	// external
	"gopkg.in/gorp.v1"
)

type Item struct {
	Id        string    `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdateAt  time.Time `json:"updated_at" db:"updated_at"`
}

func GetAllItems(dbMap *gorp.DbMap) []interface{} {
	var i []Item
	_, err := dbMap.Select(&i, "SELECT * FROM items")
	if err != nil {
		if gorp.NonFatalError(err) {
			log.Print("[WARN] Error when trying to select all items: ", err)
		} else {
			log.Fatal("[FATAL] Error when trying to select all items: ", err)
		}
	}

	items := make([]interface{}, len(i))
	for key, value := range i {
		items[key] = value
	}

	return items
}
