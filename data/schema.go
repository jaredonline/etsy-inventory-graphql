package data

import (
	"log"

	// internal
	"github.com/jaredonline/etsy-inventory/database"

	// external
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/relay"
	"gopkg.in/gorp.v1"
)

var (
	User   *graphql.Object
	Item   *graphql.Object
	query  *graphql.Object
	Schema graphql.Schema

	dbMap *gorp.DbMap

	err error
)

func init() {
	dbMap, err = database.InitDB("development")
	if err != nil {
		log.Fatal("[FATAL] could not initialize db: ", err)
	}

	User = graphql.NewObject(graphql.ObjectConfig{
		Name: "User",
		Fields: graphql.Fields{
			"id": relay.GlobalIDField("User", nil),
			"email": &graphql.Field{
				Type: graphql.String,
			},
		},
	})

	Item = graphql.NewObject(graphql.ObjectConfig{
		Name: "Item",
		Fields: graphql.Fields{
			"id": relay.GlobalIDField("Item", nil),
			"raw_id": &graphql.Field{
				Type: graphql.String,
				Resolve: func(p graphql.ResolveParams) interface{} {
					return p.Source.(database.Item).Id
				},
			},
			"name": &graphql.Field{
				Type: graphql.String,
			},
			"purchase_price_cents": &graphql.Field{
				Type: graphql.Int,
			},
			"sale_price_cents": &graphql.Field{
				Type: graphql.Int,
			},
			"potential_profit_cents": &graphql.Field{
				Type: graphql.Int,
				Resolve: func(p graphql.ResolveParams) interface{} {
					if i, ok := p.Source.(database.Item); ok {
						return i.CalcPotentialProfit()
					}
					return nil
				},
			},
		},
	})

	User.AddFieldConfig("items", &graphql.Field{
		Type: graphql.NewList(Item),
		Resolve: func(p graphql.ResolveParams) interface{} {
			return database.GetAllItems(dbMap)
		},
	})

	User.AddFieldConfig("item", &graphql.Field{
		Type: Item,
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) interface{} {
			if id, ok := p.Args["id"].(string); ok {
				log.Println("finding item with id: ", id)
				return database.GetItem(dbMap, id)
			} else {
				log.Println("[FATAL] Could not parse ID: ", p.Args["id"])
				return database.GetItem(dbMap, "1")
			}
		},
	})

	query = graphql.NewObject(graphql.ObjectConfig{
		Name: "Query",
		Fields: graphql.Fields{
			"me": &graphql.Field{
				Type: User,
				Resolve: func(p graphql.ResolveParams) interface{} {
					return database.GetUser(dbMap, 1)
				},
			},
		},
	})

	/**
	 * This is the type that will be the root of our mutations,
	 * and the entry point into performing writes in our schema.
	 */
	mutation := graphql.NewObject(graphql.ObjectConfig{
		Name: "Mutation",
		Fields: graphql.Fields{
			"newItem": &graphql.Field{
				Type: Item,
				Resolve: func(p graphql.ResolveParams) interface{} {
					item := database.Item{}
					if name, ok := p.Args["name"].(string); ok {
						item.Name = name
					}
					if sale_price_cents, ok := p.Args["sale_price_cents"].(int); ok {
						item.SalePriceCents = sale_price_cents
					}
					if purchase_price_cents, ok := p.Args["purchase_price_cents"].(int); ok {
						item.PurchasePriceCents = purchase_price_cents
					}

					return database.NewItem(dbMap, &item)
				},
				Args: graphql.FieldConfigArgument{
					"name": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"purchase_price_cents": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.Int),
					},
					"sale_price_cents": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.Int),
					},
				},
			},
		},
	})

	/**
	* Finally, we construct our schema (whose starting query type is the query
	* type we defined above) and export it.
	 */
	Schema, err = graphql.NewSchema(graphql.SchemaConfig{
		Query:    query,
		Mutation: mutation,
	})
	if err != nil {
		panic(err)
	}

}
