<?

class ApiRestHelper {
    public static function createApiCall($url, $method, $headers, $data = array()) {
        if ($method == 'PUT') {
            $headers[] = 'X-HTTP-Method-Override: PUT';
        }

        $handle = curl_init();
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);

        switch($method) {
            case 'GET':
                break;
            case 'POST':
                curl_setopt($handle, CURLOPT_POST, true);
                curl_setopt($handle, CURLOPT_POSTFIELDS, http_build_query($data));
                break;
            case 'PUT':
                curl_setopt($handle, CURLOPT_CUSTOMREQUEST, 'PUT');
                curl_setopt($handle, CURLOPT_POSTFIELDS, http_build_query($data));
                break;
            case 'DELETE':
                curl_setopt($handle, CURLOPT_CUSTOMREQUEST, 'DELETE');
                break;
        }
        $response = curl_exec($handle);
        return $response;
    }
}

$headers = array (
    'Accept: application/json',
    'ZURMO_SESSION_ID: ',
    'ZURMO_TOKEN: ',
    'ZURMO_API_REQUEST_TYPE: REST',
);
$data = Array (
    'firstName' => 'Michael',
    'lastName' => 'Smith',
    'description' => 'Some desc.',
    'website' => 'http://sample.com',
    'state' => Array (
            'id' => 1
        ),
    'primaryEmail' => Array (
            'emailAddress' => 'a@example.com',
            'optOut' => 1,
        )
);

$wholedata = array('data' => $data);

print_r($wholedata)

$response = ApiRestHelper::createApiCall('http://bd.techatnyu.org/app/index.php/leads/contact/api/create/', 'POST', $headers, array('data' => $data));
$response = json_decode($response, true);

if ($response['status'] == 'SUCCESS'){
    $contact = $response['data'];
    print_r($contact);
} else {
    $errors = $response['errors'];
    echo $errors;
    print_r($errors);
}
?>