<?php

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

/* Constants */
const HTTP_METHOD_POST = 'POST';

/* Headers */
const ARTICLE_FILE_NAME = 'X-Article-File-Name';
const ARTICLE_TITLE = 'X-Article-Title';
const ARTICLE_AUTHOR = 'X-Article-Author';
const ARTICLE_LANGUAGE = 'X-Article-Language';
const ARTICLE_LICENCE = 'X-Article-License';
const ARTICLE_PUBLISHER = 'X-Article-Publisher';

/* Program */
header('access-control-allow-methods: ' . HTTP_METHOD_POST);
header('access-control-allow-origin: *');

function getAllImageUrls(string $html) :? array
{
	if ($html) {
		$dom = new \DOMDocument( '1.0', 'UTF-8' );
		@$dom->loadHTML($html);
		$dom->preserveWhiteSpace = false;
		$images = $dom->getElementsByTagName('img');
		if ($images && count($images)) {
			$result = [];
			foreach ($images as $image) {
				$result[] = $image->getAttribute('src');
			}
			return $result;
		}
	}
	return null;
}

if ($_SERVER['REQUEST_METHOD'] === HTTP_METHOD_POST) {
	$rawData = file_get_contents('php://input');
	$httpHeaders = getallheaders();

	$epubFile = @file_get_contents(__DIR__ . '/epubs/' . $httpHeaders[ARTICLE_FILE_NAME]);
	if ($epubFile) {
		header('content-type: application/epub+zip; charset=utf-8');
		exit($epubFile);
	} else if ($rawData && $httpHeaders && isset($httpHeaders[ARTICLE_FILE_NAME]) && isset($httpHeaders[ARTICLE_TITLE])) {
		$htmlString = json_decode($rawData);
		require 'classes/TPEpubCreator.php';
		$epub = new TPEpubCreator;
		$epub->temp_folder = __DIR__ . '/temp/epub_folder';
		$epub->epub_file =  __DIR__ . '/epubs/' . $httpHeaders[ARTICLE_FILE_NAME];
		$epub->title = $httpHeaders[ARTICLE_TITLE];
		$epub->creator = $httpHeaders[ARTICLE_AUTHOR];
		$epub->language = $httpHeaders[ARTICLE_LANGUAGE];
		$epub->rights = $httpHeaders[ARTICLE_LICENCE];
		$epub->publisher = $httpHeaders[ARTICLE_PUBLISHER];
		$epub->css = file_get_contents('default.css');
		$imagesList = getAllImageUrls($htmlString);
		if ($imagesList) {
			foreach($imagesList as $imageUrl) {
				$epub->AddImage( $imageUrl, false, false);
			}
		}
		$epub->AddPage( $htmlString, false, $httpHeaders[ARTICLE_TITLE] );
		if ( !$epub->error ) {
			$epub->CreateEPUB();
			if ( !$epub->error ) {
				$epubFile = @file_get_contents(__DIR__ . '/epubs/' . $httpHeaders[ARTICLE_FILE_NAME]);
				if ($epubFile) {
					header('content-type: application/epub+zip; charset=utf-8');
					exit($epubFile);
				}
			}
		}
	}

	header('content-type: application/json; charset=utf-8');
	exit('{"status":"error"}');
}

header('content-type: application/json; charset=utf-8');
exit('{"status":"only ' . HTTP_METHOD_POST . ' data allowed"}');
