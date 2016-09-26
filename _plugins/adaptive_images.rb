module Jekyll

  class AdaptiveImageTag < Liquid::Tag

    def initialize(tag_name, tag_text, tokens)
      @tag_text = tag_text
      super
    end

    def write_hash
      File.open('_assets-cache/cache.yml', 'w') { |f| f.write $Hashes.to_yaml }
    end

    def resize_img(size, input, flag)
      path = (input.split('/')).drop(1).reverse.drop(1).reverse.join('/')
      ext = input.split('.')[1]
      name = (input.split('/')[3]).split('.')[0]
      output = "#{path}/#{name}-#{size}.#{ext}"

      if flag
        cmd = "convert -strip -interlace Plane -quality 95 -depth 8 -resize #{size} #{input[1..-1]} #{output}"
        system(cmd)
        # pid = spawn(cmd)
        # Process.wait(pid)
      end

      output
    end

    def render(context)
      render_markup = Liquid::Template.parse(@tag_text).render(context).gsub(/\\\{\\\{|\\\{\\%/, '\{\{' => '{{', '\{\%' => '{%')

      # Gather settings
      site = context.registers[:site]
      settings = site.config['adaptive_image']

      markup = /^(?<image_src>[^\s]+\.[a-zA-Z0-9]{3,4})\s*(?<html_attr>[\s\S]+)$/.match(render_markup)

      if markup

        # Assign defaults
        settings['cache'] ||= 2592000
        settings['srcset'] ||= [1920, 600, 320]
        sizes = settings['sizes'].join(',') || '100vw'
        smallest_src = nil
        src = nil

        # Process html attributes
        html_attr = if markup[:html_attr]
                      Hash[ *markup[:html_attr].scan(/(?<attr>[^\s="]+)(?:="(?<value>[^"]+)")?\s?/).flatten ]
                    else
                      {}
                    end

        if html_attr['size']
          settings['srcset'] = html_attr['size'].split(/\s+/)
          html_attr.delete('size')
        end

        if html_attr['sizes']
          attrs = html_attr['sizes'].split(/[;]/)
          sizes = attrs.map do |size|
            attr = size.split(/[ ]/)
            if attr[0] == 'min'
              str = "(min-width: "
            else
              str = "(max-width: "
            end
            str << "#{attr[1]}px) #{attr[2]}px"
          end
          sizes << "100vw"
          sizes = sizes.join(', ')
          html_attr.delete('sizes')
        end

        html_attr_string = html_attr.inject('') { |string, attrs|
          if attrs[1]
            string << "#{attrs[0]}=\"#{attrs[1]}\" "
          else
            string << "#{attrs[0]} "
          end
        }

        # set up the url
        original_source = markup[:image_src]
        if original_source[0] == '/' and original_source[1] != '/'
          original_source = "#{site.config['url']}#{original_source}"
        end

        # Add the src & srcset
        srcset = []
        input = markup[:image_src]
        md5_hash = Digest::MD5.hexdigest File.read input[1..-1]

        settings['srcset'].each do |size|
          the_src = "#{site.config['url']}/#{resize_img(size, input, $Hashes[input] != md5_hash)}"
          tail = " #{size}w"
          the_src << tail
          srcset << the_src
          if ! smallest_src or smalles_src > size
            smalles_src = size
            src = the_src.split(tail)[0]
          end
        end

        $Hashes[input] = md5_hash
        write_hash

        srcset = srcset.join(',')
        html_attr_string << " src=\"#{src}\" srcset=\"#{srcset}\""

        # Add sizes if it doesn’t exist
        if ! html_attr_string.include? 'sizes=' 
          html_attr_string << " sizes=\"#{sizes}\"" 
        end

        # Add alt if it doesn’t exist
        if ! html_attr_string.include? 'alt=' 
          html_attr_string << ' alt=""' 
        end

        "<img #{html_attr_string}>"
      end

    end
  end
end

Liquid::Template.register_tag('adaptive_image', Jekyll::AdaptiveImageTag)