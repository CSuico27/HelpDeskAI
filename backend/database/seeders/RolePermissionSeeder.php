<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            // Dashboard
            'view dashboard',

            // Ticket Management
            'view all tickets',
            'view assigned tickets',
            'view own tickets',
            'create tickets',
            'edit tickets',
            'delete tickets',
            'claim tickets',
            'assign tickets',
            'update ticket status',
            'reply to tickets',

            // User Management
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Role Management
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'assign roles',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // Create roles
        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $agent = Role::firstOrCreate([
            'name' => 'agent',
            'guard_name' => 'web',
        ]);

        $user = Role::firstOrCreate([
            'name' => 'user',
            'guard_name' => 'web',
        ]);

        // Admin
        $admin->syncPermissions(Permission::all());

        // Agent
        $agent->syncPermissions([
            'view all tickets',
            'view assigned tickets',
            'view own tickets',
            'claim tickets',
            'update ticket status',
            'reply to tickets',
            'view dashboard',
        ]);

        // User
        $user->syncPermissions([
            'view own tickets',
            'create tickets',
            'reply to tickets',
            'view dashboard',
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
