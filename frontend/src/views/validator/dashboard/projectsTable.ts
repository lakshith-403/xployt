// import { QuarkFunction as $, Quark } from './../../../ui_lib/quark';
// import { router } from './../../../ui_lib/router';
// import { ClickableFilterableTableWithCrumbs } from './../../../components/table/crumbs.click.filter.table';
// import './projectTable.scss';

// interface ContentItem {
//   id: number;
//   [key: string]: any;
// }

// export class ProjectTable extends ClickableFilterableTableWithCrumbs {
//   constructor(content: ContentItem[], headers: string[], checkboxState: { [key: string]: boolean }, filteredField: string, className: string = '') {
//     super(content, headers, checkboxState, filteredField, className);
//   }

//   public render(q: Quark): void {
//     $(q, 'div', `table ${this.className}`, {}, (q) => {
//       if (this.headers && this.headers.length > 0) {
//         $(q, 'div', 'table-header', {}, (q) => {
//           this.headers!.forEach((header) => {
//             $(q, 'span', 'table-header-cell', {}, header);
//           });
//         });
//       }
//       this.rows = $(q, 'div', 'table-rows', {}, (q) => {
//         if (!this.content || this.content.length === 0) {
//           console.log('No data available');
//           $(q, 'div', 'table-row', {}, (q) => {
//             $(q, 'span', 'table-cell last-cell', {}, 'No data available');
//           });
//         } else {
//           this.content.forEach((item) => {
//             for (const key of this.falseKeys) {
//               if (key === item[this.filteredField]) {
//                 return;
//               }
//             }
//             const url = '/projects/' + item.id;
//             $(
//               q,
//               'a',
//               'table-row-link',
//               {
//                 onclick: () => {
//                   this.updateCrumbs(item.id, url);
//                   router.navigateTo(url);
//                 },
//               },
//               (q) => {
//                 $(q, 'div', 'table-row', {}, (q) => {
//                   const values = Object.values(item);
//                   values.forEach((element, index) => {
//                     const isLastCell = index === values.length - 1;
//                     $(
//                       q,
//                       'span',
//                       `table-cell ${isLastCell ? 'last-cell' : ''}`,
//                       {},
//                       !isLastCell
//                         ? element!.toString()
//                         : (q) => {
//                             $(q, 'span', 'count', {}, element!.toString());
//                           }
//                     );
//                   });
//                 });
//               }
//             );
//           });
//         }
//       });
//     });
//   }
// }
