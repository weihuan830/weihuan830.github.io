#!/usr/bin/env python3

import asyncio
import requests
import concurrent.futures 
import json
import time
import os

###### Constant Area ######

# Credantials for each bank
HEADERS = {
    # BOC
    'BOCHK': {
        'grant_type': 'client_credentials',
        'client_id': 'l7ae41b4f79c7641dd81726c7c4845e51f',
        'client_secret': '508a177a1a39425482d8b7bb90fd36ee'
    }
}

# Domain for each bank
URLS = {
    ### BOC ###
    'BOCHK': 'https://apigateway.bochk.com/',
    'BOCHK_token': 'https://apigateway.bochk.com/auth/oauth/v2/token',
}

# BOCHK Alignment
BOCHK_BANKS = ['BOCHK']
BOCHK_COMPONENTS = [
    'deposits/product/timedeposit/v1',
    'deposits/interest/timedeposit/v1'
]

###### Constant Area End ######


# Initiation
MAX_TRIAL = 3
TODAY = time.strftime("%Y_%m_%d")
error_list = []

def obtain_token(bank):
    """ Obtains bearer token from the banks for further access to APIs
	
	Args:
		bank: The bank's name
		
	Returns:
		A dict containing the bearer token
		
	Raises:
		ConnectionError: the connection is successful but returns HTTP code other than 200 (success)
		Error: An error occurred connecting the URL.
	"""
	
    try:
        token = requests.post(URLS[bank+'_token'], headers={'Content-Type': 'application/x-www-form-urlencoded'}, data=HEADERS[bank])
        if token.status_code != requests.codes.ok:
            raise ConnectionError
        return {'Authorization': f"Bearer {token.json()['access_token']}"}
    except ConnectionError:
        print(f'Error {token.status_code} is encountered when obtaining token for {bank}')
        raise
    except:
        print(f'Connection error when obtaining token for {bank}')
        raise

def obtain_data(bank, component, http_request, url, headers, data=None, cert=None):
    """ Obtains data returned from the API.
	
	Each request will be tried three times if the response is unsuccessful. This is to 
	
	Args:
		bank: The bank's name
		component: The component's name
		http_request: The HTTP method for the request
		url: The general URL domain
		headers: The credential needed for access
		data: The credential needed for access
		cert: The certificate for access, currently exclusive to JETCO's banks
		
	Returns:
		a tuple having the request's start time as the first component and JSON response as the second.
		
	Raises:
		ConnectionError: the connection is successful but returns HTTP code other than 200 (success)
		Error: An error occurred connecting the URL.
	"""

    for trial in range(MAX_TRIAL+1):
        start_time = time.perf_counter()
        try:
            response = http_request(url, headers=headers, data=data, cert=cert, verify=False, timeout=5)
            if response.status_code != requests.codes.ok:
                if trial == MAX_TRIAL:
                    print(f'Aborted connection to {component} of {bank} due to {response.status_code} error.')
                    error_list.append((bank, response.status_code, component))
                    raise ConnectionError
                else:
                    print(f'Encountered {response.status_code} error for {component} of {bank}. Retrying...')
                    wait_one_sec(start_time)
                    continue
            else:
                print(f'Completed {component} request for {bank}')
                return (start_time, response.json())
        except:
            print(f'Encountered connection error when accessing {component} for {bank}')
            raise

def save_data(bank, component, component_name, data):
    """ Saves the data into txt document.
	
	Args:
		bank: The bank's name
		component: The component's category name
		component_name: The designated file name
		data: The data needed to be stored
	"""
    with open(f"{TODAY}/{component_name}.txt", 'w+', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

def wait_one_sec(start_time):
    """ Waits at least 0.2 seconds.
	
	Some banks only allow 1 request per second. This function serves as the time buffer.
	
	Args:
		start_time: the starting time
	"""
    time.sleep(max(start_time+1.2-time.perf_counter(), 0.2))

def take_snapshot_bochk(bank):
    """ Takes a snapshot of all components in the BOC alignment.
	
	BOC alignment requires a bearer token to access the APIs. It allows only 1 request per second.
	Since BOCHK has more components than the others, the additional components have special treatment.
	
	Args:
		bank: The bank's name in the BOC alignment
	"""
	
    # Obtain token
    try:
        token = obtain_token(bank)
    except:
        return
    
    # Obtain data
    components = BOCHK_COMPONENTS
    for component in components:
        try:
            data = obtain_data(
                        bank,
                        component,
                        http_request = requests.post,
                        url = f'{URLS[bank]}{component}',
                        headers = token,
                        data = {'pageSize': 999, 'lang': 'en-US'}
                    )
        except:
            continue
        start_time, data = data
        
        save_data(
            bank,
            component = ALL_DICT[component],
            component_name = ALL_DICT[component] if 'interest' not in component else component.replace('/v1','').replace('/','_'),
            data = data
        )
        wait_one_sec(start_time)

async def crawl():
    """ Crawls all data from all available APIs.
	
	This function first creates the folders for storage, then crawls all APIs in a concurrent manner.
	"""
    
    # Prepare folders for data
    if not os.path.exists(TODAY):
        os.makedirs(TODAY)

    # Prepare job list for concurrent spiders
    with concurrent.futures.ThreadPoolExecutor(max_workers=NUMBER_OF_THREAD) as executor:
        loop = asyncio.get_event_loop()
        tasks = []
        
        # BOCHK
        for bank in BOCHK_BANKS:
            tasks.append(
                loop.run_in_executor(
                    executor,
                    take_snapshot_bochk,
                    bank
                )
            )
        
        await asyncio.gather(*tasks)

### MAIN ###
if __name__ == "__main__":
    total_time = time.perf_counter()
    # start concurrent spider
    asyncio.run(crawl())
    print(f'Total elapsed time: { time.perf_counter()  - total_time:1f}s')
	# LSD radix sort
    if error_list:
        error_list.sort(key=lambda x: x[1])
        error_list.sort(key=lambda x: x[0])
        print('Here are the errors encountered during data collection:')
        with open(f"{TODAY}/log.txt", 'w+') as file:
            for (bank, status, component) in error_list:
                print(f"{bank} encounters error code {status} when accessing '{component}'")
                file.write(f"{bank} encounters error code {status} when accessing '{component}'\n")
    input("Press any key to continue...")

