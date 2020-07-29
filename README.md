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
- [x] XSS
- [x] Injection
- [x] CSRF
- [X] SSRF
- [x] LFI
- [x] module with cve
- [x] broken access control
- [x] source leak
- [ ] deserialization (optional)
- [x] JWT bad authentication