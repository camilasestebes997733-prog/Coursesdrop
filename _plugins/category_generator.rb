module Jekyll
  class CategoryPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'category'
        site.config['main_categories'].each do |category|
          # Get posts matching this category's keywords
          posts = site.posts.docs.select do |post|
            post_categories = post.data['categories'].to_s.downcase.split(' ')
            category['keywords'].any? { |keyword| post_categories.include?(keyword.downcase) }
          end

          # Create category page
          site.pages << CategoryPage.new(site, site.source, category, posts)
        end
      end
    end
  end

  class CategoryPage < Page
    def initialize(site, base, category, posts)
      @site = site
      @base = base
      @dir  = File.join('categories', category['slug'])
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'category.html')
      self.data['title'] = category['name']
      self.data['description'] = "Explore all #{category['name']} courses with exclusive discounts"
      self.data['posts'] = posts.sort_by { |p| p.date }.reverse
      self.data['category_slug'] = category['slug']
    end
  end
end
