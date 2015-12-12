package database

import (
	"log"
	"time"

	// external
	"gopkg.in/gorp.v1"
)

type PaymentProvider struct {
	Id              int       `json:"id" db:"id"`
	Name            string    `json:"name" db:"name"`
	ListingFeeCents int       `json:"listing_fee_cents" db:"listing_fee_cents"`
	PercentageFeeBp int       `json:"percentage_fee_bp" db:"percentage_fee_bp"`
	FlatFeeCents    int       `json:"flat_fee_cents" db:"flat_fee_cents"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time `json:"updated_at" db:"updated_at"`
}

func GetPaymentProvider(dbMap *gorp.DbMap, id int) interface{} {
	payment_provider := PaymentProvider{}
	err := dbMap.SelectOne(&payment_provider, "SELECT * FROM payment_providers WHERE id=$1", id)
	if err != nil {
		if gorp.NonFatalError(err) {
			log.Print("[WARN] Error when trying to select payment provider (", id, "): ", err)
		} else {
			log.Fatal("[FATAL] Error when trying to select payment provider (", id, "): ", err)
		}
	}

	return payment_provider
}

func GetAllPaymentProviders(dbMap *gorp.DbMap) []PaymentProvider {
	var payment_provider []PaymentProvider
	_, err := dbMap.Select(&payment_provider, "SELECT * FROM payment_providers")
	if err != nil {
		if gorp.NonFatalError(err) {
			log.Print("[WARN] Error when trying to select all payment_providers: ", err)
		} else {
			log.Fatal("[FATAL] Error when trying to select all payment providers: ", err)
		}
	}

	return payment_provider
}
