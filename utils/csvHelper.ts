import { PostData } from '../types';

export const exportToCSV = (data: PostData[], filename: string) => {
  // BOM for Excel to correctly interpret UTF-8
  const BOM = '\uFEFF';
  
  const headers = ['Keyword', 'Title', 'Author', 'Likes', 'Comments', 'Date', 'Content', 'URL'];
  
  const csvContent = data.map(row => {
    const safeText = (text: string) => `"${text.replace(/"/g, '""')}"`;
    
    return [
      safeText(row.keyword),
      safeText(row.title),
      safeText(row.author),
      row.likes,
      row.comments,
      safeText(row.date),
      safeText(row.content),
      safeText(row.url)
    ].join(',');
  }).join('\n');

  const blob = new Blob([BOM + headers.join(',') + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};