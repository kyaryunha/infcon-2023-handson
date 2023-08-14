import json

import requests
from bs4 import BeautifulSoup

site_url = 'https://www.inflearn.com'


def get_data_by_path(course_path):
    course_url = f'{site_url}{course_path}'
    response = requests.get(course_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    course_title = soup.find('h1', class_='cd-header__title').text.strip()
    instructor_name = soup.find('a', class_='cd-header__instructors--main').text.strip()
    course_tags = soup.find_all('a', class_='cd-header__tag')
    course_tag_list = []
    for course_tag in course_tags:
        course_tag_list.append(course_tag.text.strip())

    course_description = soup.find('section', 'cd-body')
    return {
        'prompt': f"강의 설명': \n{course_title} ({instructor_name}) - {' '.join(course_description.stripped_strings)[:800]}. \n 위의 강의 설명에 해당하는 태그는 다음과 같습니다.\n태그: \n",
        'completion': ', '.join(course_tag_list),
    }


results = []
for page_idx in range(1, 3):
    url = f"{site_url}/courses?order=seq&types=ONLINE&page={page_idx}"

    response = requests.get(url)

    soup = BeautifulSoup(response.text, 'html.parser')
    courses = soup.find_all('a', class_='course_card_front')

    course_paths = []

    for course in courses:
        course_path = course.get('href')
        course_paths.append(course_path)

    for course_path in course_paths:
        data = get_data_by_path(course_path)

        print(data)
        results.append(data)

with open('tag.jsonl', 'w', encoding='utf-8') as f:
    for data in results:
        json.dump(data, f)
        f.write('\n')
