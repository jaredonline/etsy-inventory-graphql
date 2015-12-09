class UseBigInt < ActiveRecord::Migration
  def up
    change_column :items, :purchase_price_cents, :bigint
    change_column :items, :sale_price_cents, :bigint
  end

  def down
    change_column :items, :purchase_price_cents, :integer
    change_column :items, :sale_price_cents, :integer
  end
end
