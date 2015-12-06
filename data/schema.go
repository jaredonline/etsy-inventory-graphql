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
	//	mutationType := graphql.NewObject(graphql.ObjectConfig{
	//		Name: "Mutation",
	//		Fields: graphql.Fields{
	//			// Add you own mutations here
	//		},
	//	})

	/**
	* Finally, we construct our schema (whose starting query type is the query
	* type we defined above) and export it.
	 */
	Schema, err = graphql.NewSchema(graphql.SchemaConfig{
		Query: query,
	})
	if err != nil {
		panic(err)
	}

}
