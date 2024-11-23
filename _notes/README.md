# Shinylive notes


```sh
conda create --name shinylive nodejs -c conda-forge -y
git clone https://github.com/posit-dev/shinylive
```

The Viewer component is the one we care about: https://github.com/posit-dev/shinylive/blob/main/src/Components/Viewer.tsx

App contains the editor, terminal and app view: https://github.com/posit-dev/shinylive/blob/main/src/Components/App.tsx - good for understanding how to interact with the Viewer

`build.ts` builds the app, and uses the `site_template` to define the pages. Each page
such as `/app` or `/examples` uses `App.tsx` with a different app mode. For example,
`/app` uses mode `viewer`.

You can execute an app using `/app#code=SOMEDATA`, check the `encode.js` to see how
to encode the data.

I passed `showHeaderBar: false` to `app/index.html` but doesn't work because of the `opts.showHeaderBar = hashParams.get("h") !== "0";` line. Removing the
component works.


## Build

```sh
make all
```

Then grab `_shinylive/r/` or `site/` (unsure what's the difference)

```sh
python -m http.server --directory _shinylive/r
```
