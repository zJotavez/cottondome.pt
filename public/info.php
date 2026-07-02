<?php
/**
 * Diagnostic Page
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Cotton Dome Diagnósticos</h1>";
echo "<p>PHP Version: " . phpversion() . "</p>";

echo "<h2>Gerador de Hash</h2>";
echo "<p>Hash de '#CD2026lda': " . password_hash('#CD2026lda', PASSWORD_DEFAULT) . "</p>";
