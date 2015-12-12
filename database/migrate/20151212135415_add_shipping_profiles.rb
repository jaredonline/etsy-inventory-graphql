class AddShippingProfiles < ActiveRecord::Migration
  def change
    create_table :shipping_profiles do |t|
      t.integer :user_id
      t.string :name
      t.bigint :cost_in_cents
      t.timestamps
    end

    add_column :items, :shipping_profile_id, :integer
  end
end
