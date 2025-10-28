<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('assigned_at');
            $table->index(['user_id', 'assigned_at']);
            $table->index('created_at');
        });

        Schema::table('parameter_user', function (Blueprint $table) {
            $table->index(['user_id', 'parameter_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('status');
            $table->index(['status', 'weight']);
        });
    }

    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['assigned_at']);
            $table->dropIndex(['user_id', 'assigned_at']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('parameter_user', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'parameter_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['status', 'weight']);
        });
    }
};
