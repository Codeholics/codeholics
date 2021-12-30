Title: Using lua-openssl to view x509 attributes
Date: 2021-03-25 07:39
Category: Coding
Tags: coding, git, crypto, infosec, lua, x509, openssl

### Intro
I recently found myself needing to view x509 certificate extended attributes with Lua. 
I had to search far and wide in posts and documentation for the lua-openssl project so, I decided to 
try and put it all in one place.

### Install lua-openssl
```
luarocks install openssl
```

### Using the openssl package
For my needs I needed to use the openssl package in the context of Nginx and using the lua-nginx-module but this can be done in any lua application.
```
-- read in the raw ssl client cert string
for k,v in pairs(openssl.x509.read(ngx.var.ssl_client_raw_cert):extensions()) do
    for x, j in pairs(v:info()) do
	if type(x) == 'string' then
	    ngx.log(ngx.WARN, "Key: " .. x .. "type: " .. type(v))
	else
	    --ngx.log(ngx.WARN, "Key not string: " .. tostring(getmetatable(x)) .. "type: " .. type(v))
	    -- subject alt name
	    ngx.log(ngx.WARN, "Key not string: " .. tostring(x:data()) .. " type: " .. tostring(v:info()))
	    for key, value in pairs(v:info()) do
	        if type(key) == 'string' then
		    ngx.log(ngx.WARN, "SAN Data: " .. key .. " type: " .. type(value))
		    if type(value) == 'userdata' and string.find(tostring(value), "string")then
		        ngx.log(ngx.WARN, "SAN Value: " .. value:toprint())
		    end
	        else
		    ngx.log(ngx.WARN, "SAN Data key not string: " .. tostring(key) .. " type: " .. type(value))
	        end
	    end
        end
        if type(j) == "table" then
	    for k2, v2 in pairs(j) do
	        ngx.log(ngx.WARN, "Key: " .. k2 .. "Type: " .. type(v2))
	    end
	    --ngx.log(ngx.WARN, "Key: " .. x)
	    --if type(j) ~= 'nil' then
	    --    ngx.log(ngx.WARN, "Value: " .. j:info())
	    --end
        end
    end
end
```

### Links:
* [lua-openssl documentation](https://zhaozg.github.io/lua-openssl/index.html)
* [lua-openssl asn1 documentation](https://zhaozg.github.io/lua-openssl/modules/asn1.html)
* [lua-openssl asn1 github](https://github.com/zhaozg/lua-openssl)
