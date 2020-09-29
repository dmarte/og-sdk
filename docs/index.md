# What it is about?
OgSDK is a set of libraries written in JavaScript to be used as independent SDK to interact with Laravel Basis API.

It is well tested with [**Laravel Sanctum**](https://laravel.com/docs/8.x/sanctum) and [**Laravel Passport**](https://laravel.com/docs/8.x/passport).

It also includes a [Nuxt.js](https://nuxtjs.org/) plugin to be used with that framework.

## So... why may I need this?
When you work with an SPA sometimes you realize that you are repeating your over and over the same steps to `fetch`,`create`,`update`,`delete`. Sometimes that could be a painful task because you need some logic around the resource your are fetching, so that your Vue or React components get messy with code you could separate in layers.

Also you may need "cast" values from APIs or just let some fields to be fetched from your API.

With OgSDK you can do all of that and more with a human readable api (Laravel Like Api).
