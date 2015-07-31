## Install Dependencies

```bash
$ npm install
$ bower install
```

This project uses Skeleton-sass (css grid system) which needs a quick setup to get it to work. On prompt enter `PROJECT_NAME`.

```bash
$ cd bower_components/skeleton-sass && bin/setup.rb
```
Now open `_PROJECT_NAME.config.scss` and add variables below to the end of the file

```bash
$is-fluid: true;
$base-col-count: 12;
```

You can now run `gulp watch` for development or just `gulp` for production.

Happy coding!