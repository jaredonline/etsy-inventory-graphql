class Item < ActiveRecord::Base
end
class User < ActiveRecord::Base
end

["items", "users"].each do |table_name|
  ActiveRecord::Base.connection.execute("TRUNCATE #{table_name} RESTART IDENTITY")
end

User.create(:email => "jared.online@gmail.com")
Item.create(:name => "Super awesome ring", :sale_price_cents => 100000, :purchase_price_cents => 1000)

