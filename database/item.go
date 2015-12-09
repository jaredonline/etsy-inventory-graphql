package database

import (
	"log"
	"time"

	// external
	"gopkg.in/gorp.v1"
)

type Item struct {
	Id                 string    `json:"id" db:"id"`
	Name               string    `json:"name" db:"name"`
	PurchasePriceCents int       `json:"purchase_price_cents" db:"purchase_price_cents"`
	SalePriceCents     int       `json:"sale_price_cents" db:"sale_price_cents"`
	CreatedAt          time.Time `json:"created_at" db:"created_at"`
	UpdatedAt          time.Time `json:"updated_at" db:"updated_at"`
}

func GetItem(dbMap *gorp.DbMap, itemID string) interface{} {
	item := Item{}
	err := dbMap.SelectOne(&item, "SELECT * FROM items WHERE id=$1", itemID)
	if err != nil {
		if gorp.NonFatalError(err) {
			log.Print("[WARN] Error when trying to select item (", itemID, "): ", err)
		} else {
			log.Fatal("[FATAL] Error when trying to select items (", itemID, "): ", err)
		}
	}

	return item
}

func GetAllItems(dbMap *gorp.DbMap) []Item {
	var i []Item
	_, err := dbMap.Select(&i, "SELECT * FROM items")
	if err != nil {
		if gorp.NonFatalError(err) {
			log.Print("[WARN] Error when trying to select all items: ", err)
		} else {
			log.Fatal("[FATAL] Error when trying to select all items: ", err)
		}
	}

	return i
}

func NewItem(dbMap *gorp.DbMap, item *Item) interface{} {
	item.CreatedAt = time.Now()
	item.UpdatedAt = time.Now()
	err := dbMap.Insert(item)
	if err != nil {
		if gorp.NonFatalError(err) {
			log.Print("[WARN] Error when trying to insert new item (", item.Name, "): ", err)
		} else {
			log.Fatal("[FATAL] Error when trying to insert new item (", item.Name, ") ", err)
		}
	} else {
		return GetItem(dbMap, item.Id)
	}

	return item
}

func (i *Item) CalcPotentialProfit() interface{} {
	return i.SalePriceCents - i.PurchasePriceCents - 1000 - ((i.SalePriceCents * 3) / 100)
}
