package database

import (
	"log"
	"time"

	// external
	"gopkg.in/gorp.v1"
)

type Item struct {
	Id                 string           `json:"id" db:"id"`
	Name               string           `json:"name" db:"name"`
	PurchasePriceCents int              `json:"purchase_price_cents" db:"purchase_price_cents"`
	SalePriceCents     int              `json:"sale_price_cents" db:"sale_price_cents"`
	ShippingProfileId  int              `json:"shipping_profile_id" db:"shipping_profile_id"`
	CreatedAt          time.Time        `json:"created_at" db:"created_at"`
	UpdatedAt          time.Time        `json:"updated_at" db:"updated_at"`
	ShippingProfile    *ShippingProfile `json:"shipping_profile" db:"-"`
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

func (i *Item) GetShippingProfile(dbMap *gorp.DbMap) *ShippingProfile {
	if i.ShippingProfile != nil {
		return i.ShippingProfile
	}

	profile := GetShippingProfile(dbMap, i.ShippingProfileId)
	if p, ok := profile.(ShippingProfile); ok {
		i.ShippingProfile = &p
		return i.ShippingProfile
	}
	return nil
}

func (i *Item) CalcPotentialProfit(dbMap *gorp.DbMap) int {
	var (
		smallestProfit = 0
		tmpProfit      = 0
	)
	providers := GetAllPaymentProviders(dbMap)
	shippingProfile := i.GetShippingProfile(dbMap)
	for _, provider := range providers {
		tmpProfit = i.calcProfitForShippingAndPayment(provider, *shippingProfile)
		if tmpProfit < smallestProfit || smallestProfit == 0 {
			smallestProfit = tmpProfit
		}
	}
	return smallestProfit
}

func (i *Item) calcProfitForShippingAndPayment(paymentProvider PaymentProvider, shipping ShippingProfile) int {
	return i.SalePriceCents - i.PurchasePriceCents - shipping.CostInCents - ((i.SalePriceCents * paymentProvider.PercentageFeeBp) / 1000) - paymentProvider.FlatFeeCents - paymentProvider.ListingFeeCents
}
