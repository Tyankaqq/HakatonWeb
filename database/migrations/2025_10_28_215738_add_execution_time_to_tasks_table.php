<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->decimal('execution_time_ms', 10, 2)->nullable()->after('assigned_at');
            $table->index('execution_time_ms');
        });
    }

    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex(['execution_time_ms']);
            $table->dropColumn('execution_time_ms');
        });
    }
};
