class Item < ActiveRecord::Base
end
class User < ActiveRecord::Base
end
class ShippingProfile < ActiveRecord::Base
end
class PaymentProvider < ActiveRecord::Base
end

["items", "users", "shipping_profiles", "payment_providers"].each do |table_name|
  ActiveRecord::Base.connection.execute("TRUNCATE #{table_name} RESTART IDENTITY")
end

User.create(:email => "jared.online@gmail.com")

ShippingProfile.create(:user_id => 1, :cost_in_cents => 1_000, :name => "Basic shipping")
ShippingProfile.create(:user_id => 1, :cost_in_cents => 10_000, :name => "Upgraded shipping")

PaymentProvider.create(:name => "PayPal", :listing_fee_cents => 0, :percentage_fee_bp => 25, :flat_fee_cents => 25)
PaymentProvider.create(:name => "Etsy", :listing_fee_cents => 20, :percentage_fee_bp => 20, :flat_fee_cents => 0)

Item.create(:name => "Super awesome ring", :sale_price_cents => 100_000, :purchase_price_cents => 1_000, :shipping_profile_id => 1)
Item.create(:name => "Super awesome necklace", :sale_price_cents => 10_000, :purchase_price_cents => 1_000, :shipping_profile_id => 1)
Item.create(:name => "Infinite ring", :sale_price_cents => 1_000_000, :purchase_price_cents => 500, :shipping_profile_id => 1)
Item.create(:name => "Cloak of invisibility", :sale_price_cents => 500_000, :purchase_price_cents => 1_438, :shipping_profile_id => 1)
Item.create(:name => "Dagger +1 Stealth", :sale_price_cents => 500_000, :purchase_price_cents => 1_438, :shipping_profile_id => 1)
Item.create(:name => "Ring of Invincibility", :sale_price_cents => 500_000, :purchase_price_cents => 1_438, :shipping_profile_id => 1)
Item.create(:name => "Sword of Mighty Slaying", :sale_price_cents => 500_000, :purchase_price_cents => 1_438, :shipping_profile_id => 1)
Item.create(:name => "Normal Boots", :sale_price_cents => 500_000, :purchase_price_cents => 1_438, :shipping_profile_id => 1)
Item.create(:name => "Bow of long and hard penetration", :sale_price_cents => 500_000, :purchase_price_cents => 1_438, :shipping_profile_id => 1)
