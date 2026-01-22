<?php

namespace App\Providers;

use App\Services\OrderCalculationService;
use Illuminate\Support\ServiceProvider;

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
        //
    }
}
