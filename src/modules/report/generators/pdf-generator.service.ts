import { Injectable } from '@nestjs/common';
import { UsageService } from 'src/modules/usage/usage.service';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class PdfGeneratorService {
  constructor(private readonly usageService: UsageService) {}

  async generateMonthlyReport(userId: bigint): Promise<string> {
    const monthlyData = await this.usageService.getMonthlyUsage(userId);

    const currentMonthData = [
      {
        month: 'June',
        api_calls: monthlyData.data?.quantity,
        expenses:
          (monthlyData.data?.totalCost?.toString() ?? '0') +
          (monthlyData.data?.currency ?? ''),
      },
    ];

    const html = this.generateReportHTML(currentMonthData, userId);

    // Convert to PDF
    const pdfPath = await this.generatePDF(html, `report_${userId}.pdf`);

    return pdfPath;
  }

  private generateReportHTML(data: any[], userId: bigint): string {
    const months = data.map((d) => `'${d.month}'`).join(',');
    const apiCalls = data.map((d) => d.api_calls).join(',');
    const expenses = data
      .map((d) => parseFloat(d.expenses.replace('BDT', '')))
      .join(',');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Monthly Usage Report</title>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                .chart-container { width: 100%; height: 400px; margin: 30px 0; }
                .summary { margin-top: 30px; }
                .summary table { width: 100%; border-collapse: collapse; }
                .summary th, .summary td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                .summary th { background-color: #f5f5f5; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Monthly Usage Report</h1>
                <p>User ID: ${userId} | Year: ${new Date().getFullYear()}</p>
                <p>Generated: ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="chart-container">
                <canvas id="usageChart"></canvas>
            </div>

            <div class="summary">
                <h3>Monthly Summary</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>API Calls</th>
                            <th>Expenses (BDT)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data
                          .map(
                            (row) => `
                            <tr>
                                <td>${row.month}</td>
                                <td>${row.api_calls.toLocaleString()}</td>
                                <td>${row.expenses}</td>
                            </tr>
                        `,
                          )
                          .join('')}
                    </tbody>
                </table>
                
                <div style="margin-top: 20px;">
                    <p><strong>Total API Calls:</strong> ${data.reduce((sum, d) => sum + d.api_calls, 0).toLocaleString()}</p>
                    <p><strong>Total Expenses:</strong> ${data.reduce((sum, d) => sum + parseFloat(d.expenses.replace('BDT', '')), 0).toFixed(0)}BDT</p>
                </div>
            </div>

            <script>
                const ctx = document.getElementById('usageChart').getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: [${months}],
                        datasets: [{
                            label: 'API Calls',
                            data: [${apiCalls}],
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            yAxisID: 'y'
                        }, {
                            label: 'Expenses ($)',
                            data: [${expenses}],
                            backgroundColor: 'rgba(255, 99, 132, 0.6)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            yAxisID: 'y1'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                type: 'linear',
                                display: true,
                                position: 'left',
                                title: { display: true, text: 'API Calls' }
                            },
                            y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                title: { display: true, text: 'Expenses ($)' },
                                grid: { drawOnChartArea: false }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Monthly API Usage & Expenses'
                            },
                            legend: {
                                display: true,
                                position: 'top'
                            }
                        }
                    }
                });
            </script>
        </body>
        </html>
    `;
  }

  private async generatePDF(html: string, filename: string): Promise<string> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const reportsDir = path.join(process.cwd(), 'reports');
    await fs.mkdir(reportsDir, { recursive: true });

    const pdfPath = path.join(reportsDir, filename);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    });

    await browser.close();
    return pdfPath;
  }
}
