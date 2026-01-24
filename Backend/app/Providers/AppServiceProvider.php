<?php

namespace App\Providers;

use App\Services\OrderCalculationService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // singleton = one instance reused (perfect for stateless logic)
        $this->app->singleton(OrderCalculationService::class, function () {
            return new OrderCalculationService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // ===== Rate limiter for RESTs Api =====
        // for users  ->  10 req / 1 min  
        RateLimiter::for('userRate', function (Request $request) {
            return Limit::perMinute(10)->by(
                $request->user()?->id ?: $request->ip()
            );
        });

        // for RESTs Api products  ->  40 req / 1 min
        RateLimiter::for('productRate', function (Request $request) {
            return Limit::perMinute(40)->by(
                $request->user()?->id ?: $request->ip()
            );
        });

        // for RESTs Api carts  ->  40 req / 1 min
        RateLimiter::for('cartRate', function (Request $request) {
            return Limit::perMinute(40)->by(
                $request->user()?->id ?: $request->ip()
            );
        });

        // get order summary & checkout payment  ->  30 req / 1 min 
        RateLimiter::for('checkoutRate', function (Request $request) {
            return Limit::perMinute(30)->by(
                $request->user()?->id ?: $request->ip()
            );
        });
    }
}
