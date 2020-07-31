# install
> git clone https://github.com/hallo1144/AIS3-DVWA.git<br>
> cd AIS3-DVWA<br>
> npm install<br>
> npm audit fix<br>
> cd frontend<br>
> npm install<br>
> npm audit fix

# run
> npm run dev

# docker

```
sudo docker-compose up --build -d
```
# db options
```
{
    "host"     : "ip or domain name",
    "port"     : "port, default: 3306",
    "user"     : "username",
    "password" : "password",
    "database" : "database name"
}
```

# session options
之後應該會換成JWT
```
{
    "key": "PHPSESSID",
    "secret": "sgSJdfgbSnbBVFS",
    "resave": false,
    "saveUninitialized": true,
    "cookie": {
		"httpOnly": true,
        "maxAge": 3600000
    }
}
```


# Holes
- [x] XSS                           [name=陳信榞]
- [x] Injection                     [name=賴侃軒]
- [x] CSRF                          [TBD]
- [X] SSRF                          []
- [x] LFI                           [TBD]
- [x] module with cve               [name=黃爾群]
- [x] broken access control         [name=楊東翰]
- [x] source leak                   [name=賴侃軒]
- [ ] deserialization (optional)
- [x] JWT bad authentication        [name=賴侃軒]