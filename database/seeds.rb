class Item < ActiveRecord::Base
end
class User < ActiveRecord::Base
end

["items", "users"].each do |table_name|
  ActiveRecord::Base.connection.execute("TRUNCATE #{table_name} RESTART IDENTITY")
end

User.create(:email => "jared.online@gmail.com")

Item.create(:name => "Super awesome ring", :sale_price_cents => 100_000, :purchase_price_cents => 1_000)
Item.create(:name => "Super awesome necklace", :sale_price_cents => 10_000, :purchase_price_cents => 1_000)
Item.create(:name => "Infinite ring", :sale_price_cents => 1_000_000, :purchase_price_cents => 500)
Item.create(:name => "Cloak of invisibility", :sale_price_cents => 500_000, :purchase_price_cents => 1_438)
