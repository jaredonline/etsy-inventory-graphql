class ItemsTable < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.string  :name
      t.integer :purchase_price_cents
      t.integer :sale_price_cents

      t.timestamps
    end
  end
end
