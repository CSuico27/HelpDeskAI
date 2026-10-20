<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_endpoint_requires_authentication(): void
    {
        $this->getJson('/api/user')->assertUnauthorized();
    }

    public function test_logout_invalidates_the_authenticated_session(): void
    {
        $this->withHeader('Origin', 'http://localhost:5173')
            ->actingAs(User::factory()->create())
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJson(['message' => 'Logout successful.']);

        $this->app['auth']->forgetGuards();

        $this->withHeader('Origin', 'http://localhost:5173')
            ->getJson('/api/user')
            ->assertUnauthorized();
    }
}
