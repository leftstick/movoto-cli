## commands ##

**Command line reference**

* [git](#git)
* [lint](#lint)
* [server](#server)


### git ###

```bash
movoto git <options>
```

**git options**

* `-u`, `--username`: Username will be displayed in `git log`
* `-e`, `--email`: Email will be displayed in `git log`

Config `git` for the local repo, including `alias`, `ui`, `encoding`...

![](./img/git.png)

### lint ###

```bash
movoto lint <filePath>
```

Lint your JavaScript source code.

* `filePath`: Can be either explicit file path, or [glob-pattern](https://github.com/isaacs/node-glob#glob-primer)

>You have to make sure the `glob-pattern` to be quoted if you use it.

![](./img/lint.png)

### server ###

```bash
movoto server [options]
```

**server options**

* `-p`, `--port`: Use a specific port for the server
* `-m`, `--html5`: Enable html5 mode, which respond with index.html for 404 request

Serve current repo as web server.

![](./img/server.png)
