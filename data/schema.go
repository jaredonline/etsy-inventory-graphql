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
	User            *graphql.Object
	Item            *graphql.Object
	ShippingProfile *graphql.Object

	Schema graphql.Schema

	query *graphql.Object
	dbMap *gorp.DbMap

	err error
)

type NewItemPayload struct {
	ClientMutationId string        `json:"clientMutationId"`
	Edge             ItemEdge      `json:"edge"`
	Me               database.User `json:"me"`
}

type PageInfo struct {
	HasPreviousPage bool `json:"hasPreviousPage"`
	HasNextPage     bool `json:"hasNextPage"`
}

type ItemEdge struct {
	Node   database.Item `json:"node"`
	Cursor string        `json:"cursor"`
}

type ItemConnection struct {
	Edges    []ItemEdge `json:"edges"`
	PageInfo PageInfo   `json:"pageInfo"`
}

type ShippingProfileEdge struct {
	Node   database.ShippingProfile `json:"node"`
	Cursor string                   `json:"cursor"`
}

type ShippingProfileConnection struct {
	Edges    []ShippingProfileEdge `json:"edges"`
	PageInfo PageInfo              `json:"pageInfo"`
}

func init() {
	dbMap, err = database.InitDB("development")
	if err != nil {
		log.Fatal("[FATAL] could not initialize db: ", err)
	}

	pageInfo := graphql.NewObject(graphql.ObjectConfig{
		Name: "PageInfo",
		Fields: graphql.Fields{
			"hasPreviousPage": &graphql.Field{
				Type: graphql.NewNonNull(graphql.Boolean),
			},
			"hasNextPage": &graphql.Field{
				Type: graphql.NewNonNull(graphql.Boolean),
			},
		},
	})

	User = graphql.NewObject(graphql.ObjectConfig{
		Name: "User",
		Fields: graphql.Fields{
			"id": relay.GlobalIDField("User", nil),
			"email": &graphql.Field{
				Type: graphql.String,
			},
		},
	})

	ShippingProfile = graphql.NewObject(graphql.ObjectConfig{
		Name: "ShippingProfile",
		Fields: graphql.Fields{
			"id": relay.GlobalIDField("ShippingProfile", nil),
			"raw_id": &graphql.Field{
				Type: graphql.String,
				Resolve: func(p graphql.ResolveParams) interface{} {
					return p.Source.(database.ShippingProfile).Id
				},
			},
			"user_id": &graphql.Field{
				Type: graphql.Int,
			},
			"name": &graphql.Field{
				Type: graphql.String,
			},
			"cost_in_cents": &graphql.Field{
				Type: graphql.Int,
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
						return i.CalcPotentialProfit(dbMap)
					}
					return nil
				},
			},
			"shipping_profile_id": &graphql.Field{
				Type: graphql.Int,
			},
			"shipping_profile": &graphql.Field{
				Type: ShippingProfile,
				Resolve: func(p graphql.ResolveParams) interface{} {
					if i, ok := p.Source.(database.Item); ok {
						return database.GetShippingProfile(dbMap, i.ShippingProfileId)
					}
					return nil
				},
			},
		},
	})

	itemEdge := graphql.NewObject(graphql.ObjectConfig{
		Name: "ItemEdge",
		Fields: graphql.Fields{
			"cursor": &graphql.Field{
				Type: graphql.NewNonNull(graphql.String),
			},
			"node": &graphql.Field{
				Type: graphql.NewNonNull(Item),
			},
		},
	})

	itemConnection := graphql.NewObject(graphql.ObjectConfig{
		Name: "ItemConnection",
		Fields: graphql.Fields{
			"edges": &graphql.Field{
				Type: graphql.NewList(itemEdge),
			},
			"pageInfo": &graphql.Field{
				Type: graphql.NewNonNull(pageInfo),
			},
		},
	})

	shippingEdge := graphql.NewObject(graphql.ObjectConfig{
		Name: "ShippingProfileEdge",
		Fields: graphql.Fields{
			"cursor": &graphql.Field{
				Type: graphql.NewNonNull(graphql.String),
			},
			"node": &graphql.Field{
				Type: graphql.NewNonNull(ShippingProfile),
			},
		},
	})

	shippingProfileConnection := graphql.NewObject(graphql.ObjectConfig{
		Name: "ShippingProfileConnection",
		Fields: graphql.Fields{
			"edges": &graphql.Field{
				Type: graphql.NewList(shippingEdge),
			},
			"pageInfo": &graphql.Field{
				Type: graphql.NewNonNull(pageInfo),
			},
		},
	})

	User.AddFieldConfig("items", &graphql.Field{
		Type: itemConnection,
		Args: graphql.FieldConfigArgument{
			"first": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
			"after": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"last": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
			"before": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
		},
		Resolve: func(p graphql.ResolveParams) interface{} {
			pageInfo := PageInfo{
				HasPreviousPage: false,
				HasNextPage:     false,
			}
			items := database.GetAllItems(dbMap)
			edges := make([]ItemEdge, len(items))
			for index, item := range items {
				edges[index] = ItemEdge{
					Node:   item,
					Cursor: string(item.Id),
				}
			}

			return ItemConnection{
				PageInfo: pageInfo,
				Edges:    edges,
			}
		},
	})

	User.AddFieldConfig("shipping_profiles", &graphql.Field{
		Type: shippingProfileConnection,
		Args: graphql.FieldConfigArgument{
			"first": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
			"after": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"last": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
			"before": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
		},
		Resolve: func(p graphql.ResolveParams) interface{} {
			pageInfo := PageInfo{
				HasPreviousPage: false,
				HasNextPage:     false,
			}
			profiles := database.GetAllShippingProfiles(dbMap)
			edges := make([]ShippingProfileEdge, len(profiles))
			for index, profile := range profiles {
				edges[index] = ShippingProfileEdge{
					Node:   profile,
					Cursor: string(profile.Id),
				}
			}

			return ShippingProfileConnection{
				PageInfo: pageInfo,
				Edges:    edges,
			}
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

	newItemInput := graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "NewItemInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"name": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"purchasePriceCents": &graphql.InputObjectFieldConfig{
				Type: graphql.Int,
			},
			"salePriceCents": &graphql.InputObjectFieldConfig{
				Type: graphql.Int,
			},
			"shippingProfileId": &graphql.InputObjectFieldConfig{
				Type: graphql.Int,
			},
			"clientMutationId": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
	})

	newItemPayload := graphql.NewObject(graphql.ObjectConfig{
		Name: "NewItemPayload",
		Fields: graphql.Fields{
			"me": &graphql.Field{
				Type: graphql.NewNonNull(User),
			},
			"edge": &graphql.Field{
				Type: graphql.NewNonNull(itemEdge),
			},
			"clientMutationId": &graphql.Field{
				Type: graphql.NewNonNull(graphql.String),
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
				Type: newItemPayload,
				Resolve: func(p graphql.ResolveParams) interface{} {
					payload := NewItemPayload{}
					edge := ItemEdge{}
					if input, ok := p.Args["input"].(map[string]interface{}); ok {
						item := database.Item{}
						if name, ok := input["name"].(string); ok {
							item.Name = name
						}
						if sale_price_cents, ok := input["salePriceCents"].(int); ok {
							item.SalePriceCents = sale_price_cents
						}
						if purchase_price_cents, ok := input["purchasePriceCents"].(int); ok {
							item.PurchasePriceCents = purchase_price_cents
						}
						if shipping_profile_id, ok := input["shippingProfileId"].(int); ok {
							item.ShippingProfileId = shipping_profile_id
						}
						if mutation_id, ok := input["clientMutationId"].(string); ok {
							payload.ClientMutationId = mutation_id
						}

						payload.Me = database.GetUser(dbMap, 1).(database.User)
						edge.Node = database.NewItem(dbMap, &item).(database.Item)
						edge.Cursor = string(edge.Node.Id)
						payload.Edge = edge
						log.Println(payload)

						return payload
					}
					log.Println(p.Args)
					return nil
				},
				Args: graphql.FieldConfigArgument{
					"input": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(newItemInput),
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
