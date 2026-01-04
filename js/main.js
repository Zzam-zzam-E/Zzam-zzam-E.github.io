/**
 * Portfolio Main JavaScript
 * 프로젝트 동적 로딩 및 UI 인터랙션
 */

// ===================================
// Configuration
// ===================================
const CONFIG = {
    projectsJsonPath: 'projects/projects.json',
    typingTexts: ['Frontend Developer', 'Backend Developer', 'Full-Stack Developer', '문제 해결사'],
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseDuration: 2000
};

// ===================================
// DOM Elements
// ===================================
const DOM = {
    projectsGrid: document.getElementById('projects-grid'),
    navToggle: document.querySelector('.nav-toggle'),
    navMenu: document.querySelector('.nav-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    typingText: document.querySelector('.typing-text'),
    footerYear: document.querySelector('.footer-year')
};

// ===================================
// Projects Loading
// ===================================
async function loadProjects() {
    try {
        // 프로젝트 목록 가져오기
        const response = await fetch(CONFIG.projectsJsonPath);
        if (!response.ok) throw new Error('프로젝트 목록을 불러올 수 없습니다.');
        
        const data = await response.json();
        const projectFolders = data.projects || [];
        
        if (projectFolders.length === 0) {
            showNoProjects();
            return;
        }
        
        // 각 프로젝트의 info.json 로드
        const projectPromises = projectFolders.map(folder => loadProjectInfo(folder));
        const projects = await Promise.all(projectPromises);
        
        // 유효한 프로젝트만 필터링
        const validProjects = projects.filter(p => p !== null);
        
        // 날짜순 정렬 (최신 먼저)
        validProjects.sort((a, b) => {
            const dateA = new Date(a.date || '1970-01');
            const dateB = new Date(b.date || '1970-01');
            return dateB - dateA;
        });
        
        // 프로젝트 카드 렌더링
        renderProjects(validProjects);
        
    } catch (error) {
        console.error('프로젝트 로딩 오류:', error);
        showError();
    }
}

async function loadProjectInfo(folder) {
    try {
        const response = await fetch(`projects/${folder}/info.json`);
        if (!response.ok) return null;
        
        const info = await response.json();
        info.folder = folder;
        return info;
    } catch (error) {
        console.warn(`프로젝트 ${folder} 로딩 실패:`, error);
        return null;
    }
}

function renderProjects(projects) {
    if (!DOM.projectsGrid) return;
    
    DOM.projectsGrid.innerHTML = '';
    
    projects.forEach((project, index) => {
        const card = createProjectCard(project, index);
        DOM.projectsGrid.appendChild(card);
    });
}

function createProjectCard(project, index) {
    const card = document.createElement('article');
    card.className = `project-card fade-in fade-in-delay-${(index % 4) + 1}`;
    
    // 썸네일 HTML
    let thumbnailHtml;
    if (project.thumbnail) {
        thumbnailHtml = `
            <div class="project-thumbnail">
                <img src="projects/${project.folder}/${project.thumbnail}" alt="${project.title}" loading="lazy">
            </div>
        `;
    } else {
        // 프로젝트 이름의 첫 글자를 이모지 대신 사용
        const initial = project.title ? project.title.charAt(0).toUpperCase() : '?';
        thumbnailHtml = `
            <div class="project-thumbnail">
                <div class="project-placeholder">${initial}</div>
            </div>
        `;
    }
    
    // 태그 HTML
    const tagsHtml = (project.tags || [])
        .map(tag => `<span class="project-tag">${tag}</span>`)
        .join('');
    
    // 링크 HTML
    let linksHtml = '';
    if (project.github) {
        linksHtml += `
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
            </a>
        `;
    }
    if (project.demo) {
        linksHtml += `
            <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="project-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Demo
            </a>
        `;
    }
    
    card.innerHTML = `
        ${thumbnailHtml}
        <div class="project-content">
            <h3 class="project-title">${project.title || '제목 없음'}</h3>
            <p class="project-description">${project.description || ''}</p>
            <div class="project-tags">${tagsHtml}</div>
            <div class="project-links">${linksHtml}</div>
        </div>
    `;
    
    return card;
}

function showNoProjects() {
    if (!DOM.projectsGrid) return;
    
    DOM.projectsGrid.innerHTML = `
        <div class="loading-spinner">
            <p>등록된 프로젝트가 없습니다.</p>
        </div>
    `;
}

function showError() {
    if (!DOM.projectsGrid) return;
    
    DOM.projectsGrid.innerHTML = `
        <div class="loading-spinner">
            <p>프로젝트를 불러오는 중 오류가 발생했습니다.</p>
        </div>
    `;
}

// ===================================
// Typing Animation
// ===================================
class TypingAnimation {
    constructor(element, texts, typingSpeed, deletingSpeed, pauseDuration) {
        this.element = element;
        this.texts = texts;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseDuration = pauseDuration;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
    }
    
    start() {
        if (!this.element) return;
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let timeout = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            timeout = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            timeout = 500;
        }
        
        setTimeout(() => this.type(), timeout);
    }
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
    // 모바일 메뉴 토글
    if (DOM.navToggle && DOM.navMenu) {
        DOM.navToggle.addEventListener('click', () => {
            DOM.navToggle.classList.toggle('active');
            DOM.navMenu.classList.toggle('active');
        });
    }
    
    // 네비게이션 링크 클릭 시 모바일 메뉴 닫기
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (DOM.navToggle && DOM.navMenu) {
                DOM.navToggle.classList.remove('active');
                DOM.navMenu.classList.remove('active');
            }
        });
    });
    
    // 스크롤 시 네비게이션 스타일 변경
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 섹션 관찰
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// ===================================
// Footer Year
// ===================================
function updateFooterYear() {
    if (DOM.footerYear) {
        DOM.footerYear.textContent = `© ${new Date().getFullYear()}`;
    }
}

// ===================================
// Smooth Scroll
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // 프로젝트 로딩
    loadProjects();
    
    // 타이핑 애니메이션
    const typing = new TypingAnimation(
        DOM.typingText,
        CONFIG.typingTexts,
        CONFIG.typingSpeed,
        CONFIG.deletingSpeed,
        CONFIG.pauseDuration
    );
    typing.start();
    
    // 네비게이션 초기화
    initNavigation();
    
    // 스크롤 애니메이션
    initScrollAnimations();
    
    // 부드러운 스크롤
    initSmoothScroll();
    
    // 푸터 연도 업데이트
    updateFooterYear();
});

