# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151212182903) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "items", force: :cascade do |t|
    t.string   "name"
    t.integer  "purchase_price_cents", limit: 8
    t.integer  "sale_price_cents",     limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "shipping_profile_id"
  end

  create_table "payment_providers", force: :cascade do |t|
    t.string   "name"
    t.integer  "percentage_fee_bp", limit: 8
    t.integer  "flat_fee_cents",    limit: 8
    t.integer  "listing_fee_cents", limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "shipping_profiles", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "name"
    t.integer  "cost_in_cents", limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
