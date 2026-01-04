# 프로젝트 템플릿

이 폴더는 새 프로젝트를 추가할 때 템플릿으로 사용됩니다.

## 새 프로젝트 추가 방법

1. 이 `_template` 폴더를 복사합니다
2. 폴더 이름을 프로젝트 이름으로 변경합니다 (예: `my-awesome-project`)
3. `info.json` 파일을 수정합니다
4. 썸네일 이미지를 추가합니다 (선택)
5. `projects/projects.json` 파일에 폴더명을 추가합니다

## info.json 필드 설명

| 필드 | 필수 | 설명 |
|------|------|------|
| `title` | ✅ | 프로젝트 제목 |
| `description` | ✅ | 프로젝트 설명 (2-3문장 권장) |
| `tags` | ❌ | 기술 스택 태그 배열 (예: `["React", "Node.js"]`) |
| `thumbnail` | ❌ | 썸네일 이미지 파일명 (없으면 제목 첫 글자 표시) |
| `github` | ❌ | GitHub 저장소 URL |
| `demo` | ❌ | 데모 사이트 URL |
| `date` | ❌ | 프로젝트 날짜 (예: `"2025-01"`, 최신순 정렬에 사용) |

## 썸네일 이미지 가이드

### 권장 크기
- **권장**: `700 x 400px` (가로 x 세로)
- **최소**: `350 x 200px`
- **비율**: `16:9` 또는 `7:4`

### 형식
- **권장 형식**: `.png`, `.jpg`, `.webp`
- **파일 크기**: 500KB 이하 권장 (웹 성능을 위해)

### 참고 사항
- 이미지는 카드에서 `object-fit: cover`로 표시되어 중앙 기준으로 잘립니다
- 중요한 내용은 이미지 중앙에 배치하세요
- Retina 디스플레이를 고려하여 2배 크기(700x400)를 권장합니다

## 예시

### info.json 작성 예시

```json
{
    "title": "포트폴리오 웹사이트",
    "description": "GitHub Pages를 활용한 개인 포트폴리오 사이트입니다. 반응형 디자인과 다크 테마를 적용했습니다.",
    "tags": ["HTML", "CSS", "JavaScript"],
    "thumbnail": "thumbnail.png",
    "github": "https://github.com/username/portfolio",
    "demo": "https://username.github.io/portfolio",
    "date": "2025-01"
}
```

### projects.json 등록 예시

```json
{
    "projects": ["portfolio", "todo-app", "weather-app"]
}
```

프로젝트는 `date` 필드 기준으로 최신순 정렬됩니다.

