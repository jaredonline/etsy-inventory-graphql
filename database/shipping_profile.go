package database

import (
	"log"
	"time"

	// external
	"gopkg.in/gorp.v1"
)

type ShippingProfile struct {
	Id          int       `json:"id" db:"id"`
	UseId       int       `json:"user_id" db:"user_id"`
	User        *User     `json:"user"`
	Name        string    `json:"name" db:"name"`
	CostInCents int       `json:"cost_in_cents" db:"cost_in_cents"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

func GetShippingProfile(dbMap *gorp.DbMap, id int) interface{} {
	shipping_profile := ShippingProfile{}
	err := dbMap.SelectOne(&shipping_profile, "SELECT * FROM shipping_profiles WHERE id=$1", id)
	if err != nil {
		if gorp.NonFatalError(err) {
			log.Print("[WARN] Error when trying to select shipping profile (", id, "): ", err)
		} else {
			log.Fatal("[FATAL] Error when trying to select shipping profile (", id, "): ", err)
		}
	}

	return shipping_profile
}

func GetAllShippingProfiles(dbMap *gorp.DbMap) []ShippingProfile {
	var shipping_profile []ShippingProfile
	_, err := dbMap.Select(&shipping_profile, "SELECT * FROM shipping_profiles")
	if err != nil {
		if gorp.NonFatalError(err) {
			log.Print("[WARN] Error when trying to select all shipping_profiles: ", err)
		} else {
			log.Fatal("[FATAL] Error when trying to select all shipping_profiles: ", err)
		}
	}

	return shipping_profile
}
