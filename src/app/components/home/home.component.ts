import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { TokenService } from 'src/app/services/token.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = []; // Dữ liệu động từ categoryService
  selectedCategoryId: number = 0; // Giá trị category được chọn
  currentPage: number = 1;
  itemsPerPage: number = 12; // Số lượng sản phẩm trên mỗi trang
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
    this.getCategories(1, 100);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        debugger;
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  searchProducts() {
    this.currentPage = 1;
    this.itemsPerPage = 12;
    debugger;
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
  }

  getProducts(
    keyword: string,
    selectedCategoryId: number,
    page: number,
    limit: number
  ) {
    this.productService
      .getProducts(keyword, selectedCategoryId, page, limit)
      .subscribe({
        next: (response: any) => {
          debugger;
          console.log('Raw response from API:', response); // 🧪 log toàn bộ phản hồi

          response.products.forEach((product: any, index: number) => {
            console.log(`Product #${index}:`, product); // 🧪 từng product
            console.log('ID:', product.id); // 👈 kiểm tra kỹ ID tại đây
          });
          response.products.forEach((product: Product) => {
            product.url = product.thumbnail
              ? `${environment.apiBaseUrl}/products/images/${product.thumbnail}`
              : 'assets/img/Tiramisu_1426.jpeg'; // fallback ảnh mặc định frontend
          });
          this.products = response.products;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(
            this.currentPage,
            this.totalPages
          );
        },
        complete: () => {
          debugger;
          console.log('Products fetched successfully');
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        },
      });
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 10;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }

  // Hàm xử lý sự kiện khi sản phẩm được bấm vào
  onProductClick(productId: number) {
    debugger
    console.log('Clicked productId:', productId);
    if (productId !== undefined && productId !== null) {
      this.router.navigate(['/products', productId]);
    } else {
      console.error('Invalid productId in click handler:', productId);
    }
  }
}
