The Github `sync fork` option doesn't seem to sync tags, you may need to manually do this otherwise you may not be able to build from a specific release version...

```
git remote add upstream https://github.com/prebid/prebid.js.git
git fetch upstream --tags
git push origin --tags
```