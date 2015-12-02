require "pathname"
require 'active_record_migrations'

class SeedLoader
  def self.load_seed
    seed_file = Pathname.new(Dir.pwd).join("database", "seeds.rb")
    load(seed_file.to_s) if seed_file.exist?
  end
end

ActiveRecordMigrations.configure do |c|
  c.yaml_config = "config/database.yml"
  c.db_dir = "database"
  c.migrations_paths = ['database/migrate']
  c.seed_loader = SeedLoader
end

ActiveRecordMigrations.load_tasks
