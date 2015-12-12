class PaymentProviders < ActiveRecord::Migration
  def change
    create_table :payment_providers do |t|
      t.string :name
      t.bigint :percentage_fee_bp
      t.bigint :flat_fee_cents
      t.bigint :listing_fee_cents

      t.timestamps
    end
  end
end
