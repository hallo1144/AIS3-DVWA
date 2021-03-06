# run directly
## install
> git clone https://github.com/hallo1144/AIS3-DVWA.git<br>
> cd AIS3-DVWA<br>
> npm install<br>
> npm audit fix<br>
> cd frontend<br>
> npm install<br>
> npm audit fix

## run
> npm run merge

## modify db options
```
AIS3-DVWA/api/tools/DbOptions.json:
{
    "host"     : "ip or domain name",
    "port"     : "port, default: 3306",
    "user"     : "username",
    "password" : "password",
    "database" : "database name"
}
```

## modify session options
```
{
    "key": "name of your session",
    "secret": "session secret",
    "resave": false,
    "saveUninitialized": true,
    "cookie": {
		"httpOnly": true,
        "maxAge": 3600000
    }
}
```

# ... or run in docker

```
sudo docker-compose up --build -d
```

# Holes
- [x] XSS                           [name=陳信榞]
- [x] Injection                     [name=賴侃軒]
- [x] CSRF                          [name=賴侃軒]
- [ ] SSRF                          [TBD]
- [x] LFI                           [name=賴侃軒]
- [x] module with cve               [name=黃爾群]
- [x] broken access control         [name=楊東翰]
- [x] source leak                   [name=賴侃軒]
- [x] deserialization (optional)    [name=黃爾群]
- [x] JWT bad authentication        [name=賴侃軒]
