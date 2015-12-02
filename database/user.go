package database

import (
	"log"
	"time"

	// external
	"gopkg.in/gorp.v1"
)

type User struct {
	Id        string    `json:"id" db:"id"`
	Email     string    `json:"email" db:"email"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdateAt  time.Time `json:"updated_at" db:"updated_at"`
}

func GetUser(dbMap *gorp.DbMap, user_id int) interface{} {
	user := User{}
	err := dbMap.SelectOne(&user, "SELECT * FROM users WHERE id=$1", user_id)
	if err != nil {
		if gorp.NonFatalError(err) {
			log.Print("[WARN] Error when trying to select all items: ", err)
		} else {
			log.Fatal("[FATAL] Error when trying to select all items: ", err)
		}
	}

	return user
}
