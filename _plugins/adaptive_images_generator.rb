
module Jekyll

  class Resizer
    def resize_blog_img()
      sizes = [350, 450, 700]
      images = Dir['img/blog-post/post*c.jpg']

      images.map do |image|
        name = (image.split('/')[2]).split('.')[0]
        sizes.map do |size|
          cmd = "convert -strip -interlace Plane -quality 95 -depth 8 -resize #{size} #{image} img/blog-post/#{name}-#{size}.jpg"
          pid = spawn(cmd)
          Process.wait(pid)
        end
      end
    end

    def resize_portfolio_img()
      sizes = [350, 450, 700]
      images = Dir['img/portfolio/work*p.jpg']

      images.map do |image|
        name = (image.split('/')[2]).split('.')[0]
        sizes.map do |size|
          cmd = "convert -strip -interlace Plane -quality 95 -depth 8 -resize #{size} #{image} img/portfolio/#{name}-#{size}.jpg"
          pid = spawn(cmd)
          Process.wait(pid)
        end
      end
    end
  end

  class ImgResizeGenerator < Generator
    safe true

    def generate(site)

      resizer = Resizer.new()

      resizer.resize_portfolio_img()
      resizer.resize_blog_img()
    end
  end
end

