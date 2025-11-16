// products.js - Product functionality untuk MIVO (VERSI DIPERBAIKI)

class MIVOProducts {
    constructor() {
        this.wishlist = JSON.parse(localStorage.getItem('mivoWishlist')) || [];
        this.currentDemo = 'biogas'; // Default demo
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupFiltering();
        this.setupWishlist();
        this.setupQuickView();
        this.setupOverlayButtons();
        this.setupDemoControls();
        
        // Initialize default demo
        this.setupDemoAnimation('biogas');
        this.setupDemoStats('biogas');
        
        console.log('MIVO Products initialized');
    }

    setupFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const products = document.querySelectorAll('.product-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                
                products.forEach(product => {
                    // PERBAIKAN: Gunakan === bukan includes untuk filter yang tepat
                    if (filter === 'all' || product.dataset.category === filter) {
                        product.style.display = 'block';
                        setTimeout(() => {
                            product.style.opacity = '1';
                            product.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        product.style.opacity = '0';
                        product.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            product.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    setupWishlist() {
        const wishlistBtns = document.querySelectorAll('.wishlist-btn');
        
        wishlistBtns.forEach(btn => {
            const productId = btn.dataset.product;
            this.updateWishlistButton(btn, productId);

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleWishlist(productId, btn);
            });
        });
    }

    updateWishlistButton(button, productId) {
        const isInWishlist = this.wishlist.includes(productId);
        const icon = button.querySelector('.wishlist-icon');
        
        if (isInWishlist) {
            button.classList.add('active');
            icon.textContent = '❤️';
        } else {
            button.classList.remove('active');
            icon.textContent = '🤍';
        }
    }

    toggleWishlist(productId, button) {
        const isInWishlist = this.wishlist.includes(productId);

        if (isInWishlist) {
            // Remove from wishlist
            this.wishlist = this.wishlist.filter(id => id !== productId);
            this.showNotification('Produk dihapus dari wishlist', 'info');
        } else {
            // Add to wishlist
            this.wishlist.push(productId);
            this.showNotification('Produk ditambahkan ke wishlist', 'success');
        }

        // Update all wishlist buttons for this product
        const allWishlistBtns = document.querySelectorAll(`.wishlist-btn[data-product="${productId}"]`);
        allWishlistBtns.forEach(btn => {
            this.updateWishlistButton(btn, productId);
        });

        localStorage.setItem('mivoWishlist', JSON.stringify(this.wishlist));
    }

    setupQuickView() {
        const quickViewBtns = document.querySelectorAll('.quick-view');
        
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = btn.dataset.product;
                console.log('Quick view clicked for:', productId);
                this.showDemo(productId);
            });
        });
    }

    setupOverlayButtons() {
        const overlayBtns = document.querySelectorAll('.quick-view-overlay');
        
        overlayBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = btn.dataset.product;
                console.log('Overlay quick view clicked for:', productId);
                this.showDemo(productId);
            });
        });
    }

    showDemo(productId) {
        this.currentDemo = productId;
        const productData = this.getProductData(productId);
        
        if (productData) {
            // Update demo section
            const demoTitle = document.getElementById('demoTitle');
            if (demoTitle) {
                demoTitle.textContent = productData.title;
            }
            this.setupDemoAnimation(productId);
            this.setupDemoStats(productId);
            
            // Scroll to demo section
            const demoSection = document.querySelector('.demo-section');
            if (demoSection) {
                demoSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        }
    }

    setupDemoControls() {
        const startBtn = document.getElementById('startDemo');
        const resetBtn = document.getElementById('resetDemo');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startAnimation();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetAnimation();
            });
        }
    }

    setupDemoAnimation(productId) {
        const animationContainer = document.getElementById('demoAnimation');
        if (!animationContainer) return;
        
        animationContainer.innerHTML = '';
        animationContainer.className = 'demo-animation';
        
        // Add specific class based on product
        animationContainer.classList.add(`${productId}-animation`);
        
        if (productId === 'biogas') {
            this.setupBiogasAnimation(animationContainer);
        } else if (productId === 'biooil') {
            this.setupBiooilAnimation(animationContainer);
        } else if (productId === 'pupuk') {
            this.setupPupukAnimation(animationContainer);
        }
    }

    setupBiogasAnimation(container) {
        // Input material (fish waste)
        const input = document.createElement('div');
        input.className = 'animation-element input-material';
        input.innerHTML = '🐟';
        input.style.left = '50px';
        input.style.top = '120px';
        input.style.backgroundColor = '#ffeb3b';
        container.appendChild(input);
        
        // Process arrow 1
        const arrow1 = document.createElement('div');
        arrow1.className = 'animation-element process-arrow';
        arrow1.style.left = '130px';
        arrow1.style.top = '145px';
        container.appendChild(arrow1);
        
        // Biogas reactor
        const reactor = document.createElement('div');
        reactor.className = 'animation-element process-chamber';
        reactor.innerHTML = '⚗️';
        reactor.style.left = '180px';
        reactor.style.top = '90px';
        container.appendChild(reactor);
        
        // Process arrow 2
        const arrow2 = document.createElement('div');
        arrow2.className = 'animation-element process-arrow';
        arrow2.style.left = '320px';
        arrow2.style.top = '145px';
        container.appendChild(arrow2);
        
        // Biogas output
        const biogas = document.createElement('div');
        biogas.className = 'animation-element output-product';
        biogas.innerHTML = '🔥';
        biogas.style.left = '370px';
        biogas.style.top = '110px';
        biogas.style.backgroundColor = '#ff9800';
        container.appendChild(biogas);
        
        // Fertilizer output
        const fertilizer = document.createElement('div');
        fertilizer.className = 'animation-element output-product';
        fertilizer.innerHTML = '🌿';
        fertilizer.style.left = '370px';
        fertilizer.style.top = '210px';
        fertilizer.style.backgroundColor = '#8bc34a';
        container.appendChild(fertilizer);
        
        // Arrow to fertilizer
        const arrow3 = document.createElement('div');
        arrow3.className = 'animation-element process-arrow';
        arrow3.style.left = '320px';
        arrow3.style.top = '245px';
        arrow3.style.transform = 'rotate(90deg)';
        container.appendChild(arrow3);
    }

    setupBiooilAnimation(container) {
        // Input material (biomass)
        const input = document.createElement('div');
        input.className = 'animation-element input-material';
        input.innerHTML = '🌿';
        input.style.left = '50px';
        input.style.top = '120px';
        input.style.backgroundColor = '#8bc34a';
        container.appendChild(input);
        
        // Process arrow 1
        const arrow1 = document.createElement('div');
        arrow1.className = 'animation-element process-arrow';
        arrow1.style.left = '130px';
        arrow1.style.top = '145px';
        container.appendChild(arrow1);
        
        // Pyrolysis reactor
        const reactor = document.createElement('div');
        reactor.className = 'animation-element process-chamber';
        reactor.innerHTML = '🔥';
        reactor.style.left = '180px';
        reactor.style.top = '90px';
        container.appendChild(reactor);
        
        // Process arrow 2
        const arrow2 = document.createElement('div');
        arrow2.className = 'animation-element process-arrow';
        arrow2.style.left = '320px';
        arrow2.style.top = '145px';
        container.appendChild(arrow2);
        
        // Biooil output
        const biooil = document.createElement('div');
        biooil.className = 'animation-element output-product';
        biooil.innerHTML = '🛢️';
        biooil.style.left = '370px';
        biooil.style.top = '110px';
        biooil.style.backgroundColor = '#795548';
        container.appendChild(biooil);
        
        // Biochar output
        const biochar = document.createElement('div');
        biochar.className = 'animation-element output-product';
        biochar.innerHTML = '⚫';
        biochar.style.left = '370px';
        biochar.style.top = '210px';
        biochar.style.backgroundColor = '#3e2723';
        container.appendChild(biochar);
        
        // Arrow to biochar
        const arrow3 = document.createElement('div');
        arrow3.className = 'animation-element process-arrow';
        arrow3.style.left = '320px';
        arrow3.style.top = '245px';
        arrow3.style.transform = 'rotate(90deg)';
        container.appendChild(arrow3);
    }

    setupPupukAnimation(container) {
        // Input material (digestate)
        const input = document.createElement('div');
        input.className = 'animation-element input-material';
        input.innerHTML = '💧';
        input.style.left = '50px';
        input.style.top = '120px';
        input.style.backgroundColor = '#4fc3f7';
        container.appendChild(input);
        
        // Process arrow 1
        const arrow1 = document.createElement('div');
        arrow1.className = 'animation-element process-arrow';
        arrow1.style.left = '130px';
        arrow1.style.top = '145px';
        container.appendChild(arrow1);
        
        // Mixing tank
        const tank = document.createElement('div');
        tank.className = 'animation-element process-chamber';
        tank.innerHTML = '🔄';
        tank.style.left = '180px';
        tank.style.top = '90px';
        container.appendChild(tank);
        
        // Process arrow 2
        const arrow2 = document.createElement('div');
        arrow2.className = 'animation-element process-arrow';
        arrow2.style.left = '320px';
        arrow2.style.top = '145px';
        container.appendChild(arrow2);
        
        // Fertilizer output
        const fertilizer = document.createElement('div');
        fertilizer.className = 'animation-element output-product';
        fertilizer.innerHTML = '🌱';
        fertilizer.style.left = '370px';
        fertilizer.style.top = '110px';
        fertilizer.style.backgroundColor = '#66bb6a';
        container.appendChild(fertilizer);
        
        // Plants growing
        const plants = document.createElement('div');
        plants.className = 'animation-element';
        plants.innerHTML = '🌾🌽';
        plants.style.left = '450px';
        plants.style.top = '120px';
        plants.style.fontSize = '2rem';
        container.appendChild(plants);
    }

    setupDemoStats(productId) {
        const statsContainer = document.getElementById('demoStats');
        if (!statsContainer) return;
        
        statsContainer.innerHTML = '';
        
        let stats = [];
        
        if (productId === 'biogas') {
            stats = [
                { value: '2-5 m³/hari', label: 'Produksi Biogas' },
                { value: '20-30 hari', label: 'Waktu Proses' },
                { value: '85%', label: 'Efisiensi' },
                { value: '10+ tahun', label: 'Masa Pakai' }
            ];
        } else if (productId === 'biooil') {
            stats = [
                { value: '35-45%', label: 'Yield Bio-oil' },
                { value: '2-4 jam', label: 'Waktu Proses' },
                { value: '400-600°C', label: 'Suhu Operasi' },
                { value: '50 kg/jam', label: 'Kapasitas' }
            ];
        } else if (productId === 'pupuk') {
            stats = [
                { value: '3-2-2', label: 'Kandungan NPK' },
                { value: '6.5-7.5', label: 'pH Optimal' },
                { value: '10^8 CFU/ml', label: 'Mikroba Aktif' },
                { value: '40%', label: 'Peningkatan Hasil' }
            ];
        }
        
        stats.forEach(stat => {
            const statCard = document.createElement('div');
            statCard.className = 'stat-card';
            statCard.innerHTML = `
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
            `;
            statsContainer.appendChild(statCard);
        });
    }

    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const elements = document.querySelectorAll('#demoAnimation .animation-element');
        
        // Reset positions first
        elements.forEach(el => {
            el.style.transform = 'translateX(0)';
            el.style.opacity = '1';
        });
        
        // Animate elements in sequence
        elements.forEach((el, index) => {
            setTimeout(() => {
                if (el.classList.contains('input-material')) {
                    el.style.transform = 'translateX(80px)';
                } else if (el.classList.contains('process-arrow')) {
                    el.style.opacity = '0.3';
                    setTimeout(() => {
                        el.style.opacity = '1';
                    }, 500);
                } else if (el.classList.contains('process-chamber')) {
                    el.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        el.style.transform = 'scale(1)';
                    }, 500);
                } else if (el.classList.contains('output-product')) {
                    el.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        el.style.transform = 'scale(1)';
                    }, 500);
                }
            }, index * 800);
        });
        
        // Reset animation state after completion
        setTimeout(() => {
            this.isAnimating = false;
        }, elements.length * 800 + 1000);
    }

    resetAnimation() {
        const elements = document.querySelectorAll('#demoAnimation .animation-element');
        
        elements.forEach(el => {
            el.style.transform = '';
            el.style.opacity = '';
        });
        
        this.isAnimating = false;
    }

    getProductData(productId) {
        const products = {
            'biogas': {
                title: 'Reaktor Biogas Laut',
                description: 'Sistem biogas inovatif yang mengkonversi limbah ikan menjadi energi terbarukan untuk kebutuhan rumah tangga dan industri kecil.'
            },
            'biooil': {
                title: 'BioOil Converter',
                description: 'Teknologi pirolisis canggih untuk mengubah biomassa laut menjadi bio-oil berkualitas tinggi sebagai bahan bakar alternatif.'
            },
            'pupuk': {
                title: 'Pupuk Cair Laut',
                description: 'Pupuk organik cair kaya nutrisi dari residu proses biogas, ideal untuk pertanian pesisir dan budidaya tambak.'
            }
        };

        return products[productId];
    }

    showNotification(message, type = 'info') {
        // Simple notification implementation
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize products when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mivoProducts = new MIVOProducts();
});