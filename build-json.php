<?php
$files = scandir('./demos');

$map = [];

foreach ($files as $file) {
    if ($file[0] === '.') {
        continue;
    }

    list($name, $ext) = explode('.', $file);
    $map[$name] = isset($map[$name]) ? $map[$name] : [];
    $map[$name][$ext === 'xml' ? 'lang' : 'data'] = file_get_contents('./demos/'.$file);
}

echo json_encode($map);