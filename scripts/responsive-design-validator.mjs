#!/usr/bin/env node

/**
 * Responsive Design Validator for MastroHUB v2
 * Automated validation of responsive design across all breakpoints
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, dirname, basename, extname } from "path";

class ResponsiveDesignValidator {
  constructor() {
    this.breakpoints = {
      mobile: { min: 320, max: 767, name: 'Mobile' },
      tablet: { min: 768, max: 1023, name: 'Tablet' },
      desktop: { min: 1024, max: 1279, name: 'Desktop' },
      wide: { min: 1280, max: 1920, name: 'Wide Desktop' }
    };
    
    this.responsiveRules = {
      mobile: {
        required: ['sm:', 'max-sm:', 'mobile:'],
        recommended: ['text-sm', 'p-4', 'space-y-4'],
        forbidden: ['lg:', 'xl:', '2xl:'],
        patterns: [
          { pattern: /sm:/g, message: 'Mobile-first responsive design' },
          { pattern: /max-sm:/g, message: 'Mobile-specific styles' },
          { pattern: /mobile:/g, message: 'Custom mobile breakpoint' }
        ]
      },
      tablet: {
        required: ['md:', 'max-md:', 'tablet:'],
        recommended: ['text-base', 'p-6', 'space-y-6'],
        forbidden: ['xl:', '2xl:'],
        patterns: [
          { pattern: /md:/g, message: 'Tablet breakpoint used' },
          { pattern: /max-md:/g, message: 'Tablet-specific styles' },
          { pattern: /tablet:/g, message: 'Custom tablet breakpoint' }
        ]
      },
      desktop: {
        required: ['lg:', 'max-lg:', 'desktop:'],
        recommended: ['text-lg', 'p-8', 'space-y-8'],
        forbidden: ['2xl:'],
        patterns: [
          { pattern: /lg:/g, message: 'Desktop breakpoint used' },
          { pattern: /max-lg:/g, message: 'Desktop-specific styles' },
          { pattern: /desktop:/g, message: 'Custom desktop breakpoint' }
        ]
      },
      wide: {
        required: ['xl:', '2xl:', 'wide:'],
        recommended: ['text-xl', 'p-12', 'space-y-12'],
        patterns: [
          { pattern: /xl:/g, message: 'Large desktop breakpoint used' },
          { pattern: /2xl:/g, message: 'Extra large breakpoint used' },
          { pattern: /wide:/g, message: 'Custom wide breakpoint' }
        ]
      }
    };
    
    this.responsiveIssues = [];
    this.componentAnalysis = {};
  }

  async validateResponsiveDesign() {
    console.log("📱 Validating responsive design across all breakpoints...");
    
    // Analyze all components
    await this.analyzeComponents();
    
    // Check breakpoint coverage
    await this.checkBreakpointCoverage();
    
    // Check mobile-first approach
    await this.checkMobileFirstApproach();
    
    // Check responsive patterns
    await this.checkResponsivePatterns();
    
    // Generate responsive report
    const report = this.generateResponsiveReport();
    
    return report;
  }

  async analyzeComponents() {
    console.log("📊 Analyzing component responsiveness...");
    
    const componentsDir = "components";
    if (!existsSync(componentsDir)) {
      console.log("❌ Components directory not found");
      return;
    }

    const components = this.getComponentFiles(componentsDir);
    
    for (const component of components) {
      const analysis = await this.analyzeComponent(component);
      this.componentAnalysis[basename(component, extname(component))] = analysis;
    }

    console.log(`✅ Analyzed ${components.length} components for responsiveness`);
  }

  getComponentFiles(dir, files = []) {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.getComponentFiles(fullPath, files);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async analyzeComponent(filePath) {
    const content = readFileSync(filePath, 'utf8');
    const componentName = basename(filePath, extname(filePath));
    
    const analysis = {
      name: componentName,
      path: filePath,
      score: 100,
      issues: [],
      warnings: [],
      breakpoints: {
        mobile: this.checkBreakpoint(content, 'mobile'),
        tablet: this.checkBreakpoint(content, 'tablet'),
        desktop: this.checkBreakpoint(content, 'desktop'),
        wide: this.checkBreakpoint(content, 'wide')
      },
      patterns: this.checkResponsivePatterns(content),
      mobileFirst: this.checkMobileFirst(content)
    };

    // Calculate overall score
    const breakpointScores = Object.values(analysis.breakpoints).map(bp => bp.score);
    const avgBreakpointScore = breakpointScores.reduce((sum, score) => sum + score, 0) / breakpointScores.length;
    
    analysis.score = Math.round(avgBreakpointScore);

    // Collect all issues and warnings
    Object.values(analysis.breakpoints).forEach(breakpoint => {
      if (breakpoint.issues) analysis.issues.push(...breakpoint.issues);
      if (breakpoint.warnings) analysis.warnings.push(...breakpoint.warnings);
    });
    
    if (analysis.patterns && analysis.patterns.issues) {
      analysis.issues.push(...analysis.patterns.issues);
    }
    if (analysis.patterns && analysis.patterns.warnings) {
      analysis.warnings.push(...analysis.patterns.warnings);
    }

    return analysis;
  }

  checkBreakpoint(content, breakpoint) {
    const rules = this.responsiveRules[breakpoint];
    const result = { score: 100, issues: [], warnings: [] };
    
    // Check for required breakpoint classes
    const hasRequired = rules.required.some(required => content.includes(required));
    if (!hasRequired) {
      result.issues.push(`Missing ${breakpoint} breakpoint classes`);
      result.score -= 25;
    }
    
    // Check for forbidden breakpoint classes
    if (rules.forbidden && rules.forbidden.length > 0) {
      rules.forbidden.forEach(forbidden => {
        if (content.includes(forbidden)) {
          result.issues.push(`Forbidden breakpoint class in ${breakpoint}: ${forbidden}`);
          result.score -= 15;
        }
      });
    }
    
    // Check for recommended patterns
    if (rules.patterns && rules.patterns.length > 0) {
      rules.patterns.forEach(pattern => {
        const matches = content.match(pattern.pattern);
        if (matches) {
          result.warnings.push(`${pattern.message}: ${matches.join(', ')}`);
          result.score += 5; // Bonus for good patterns
        }
      });
    }
    
    // Check for recommended classes
    if (rules.recommended && rules.recommended.length > 0) {
      rules.recommended.forEach(recommended => {
        if (content.includes(recommended)) {
          result.warnings.push(`Good ${breakpoint} pattern: ${recommended}`);
          result.score += 2;
        }
      });
    }
    
    return result;
  }

  checkResponsivePatterns(content) {
    const result = { issues: [], warnings: [] };
    
    // Check for responsive grid patterns
    if (content.includes('grid') && !content.includes('sm:grid') && !content.includes('md:grid')) {
      result.issues.push('Grid layout not responsive');
    }
    
    // Check for responsive flex patterns
    if (content.includes('flex') && !content.includes('sm:flex') && !content.includes('md:flex')) {
      result.issues.push('Flex layout not responsive');
    }
    
    // Check for responsive text patterns
    if (content.includes('text-') && !content.includes('sm:text-') && !content.includes('md:text-')) {
      result.issues.push('Text sizes not responsive');
    }
    
    // Check for responsive spacing patterns
    if (content.includes('p-') && !content.includes('sm:p-') && !content.includes('md:p-')) {
      result.issues.push('Padding not responsive');
    }
    
    if (content.includes('m-') && !content.includes('sm:m-') && !content.includes('md:m-')) {
      result.issues.push('Margin not responsive');
    }
    
    // Check for responsive visibility patterns
    if (content.includes('hidden') && !content.includes('sm:hidden') && !content.includes('md:hidden')) {
      result.issues.push('Visibility not responsive');
    }
    
    // Check for good responsive patterns
    const goodPatterns = [
      { pattern: /sm:block/g, message: 'Good: Mobile-first block display' },
      { pattern: /md:flex/g, message: 'Good: Tablet flex layout' },
      { pattern: /lg:grid/g, message: 'Good: Desktop grid layout' },
      { pattern: /xl:space-y-/g, message: 'Good: Large screen spacing' },
      { pattern: /2xl:text-/g, message: 'Good: Extra large text sizing' }
    ];
    
    if (goodPatterns && goodPatterns.length > 0) {
      goodPatterns.forEach(pattern => {
        const matches = content.match(pattern.pattern);
        if (matches) {
          result.warnings.push(`${pattern.message}: ${matches.join(', ')}`);
        }
      });
    }
    
    return result;
  }

  checkMobileFirst(content) {
    const result = { score: 100, issues: [], warnings: [] };
    
    // Check for mobile-first approach
    const hasMobileFirst = content.includes('sm:') || content.includes('mobile:');
    if (!hasMobileFirst) {
      result.issues.push('Not using mobile-first approach');
      result.score -= 30;
    }
    
    // Check for proper breakpoint order
    const breakpointOrder = ['sm:', 'md:', 'lg:', 'xl:', '2xl:'];
    let lastBreakpointIndex = -1;
    let hasProperOrder = true;
    
    breakpointOrder.forEach((breakpoint, index) => {
      if (content.includes(breakpoint)) {
        if (index < lastBreakpointIndex) {
          hasProperOrder = false;
        }
        lastBreakpointIndex = index;
      }
    });
    
    if (!hasProperOrder) {
      result.issues.push('Breakpoints not in proper order (mobile-first)');
      result.score -= 20;
    }
    
    // Check for responsive container patterns
    if (content.includes('container') && !content.includes('sm:container')) {
      result.issues.push('Container not responsive');
      result.score -= 15;
    }
    
    return result;
  }

  async checkBreakpointCoverage() {
    console.log("📊 Checking breakpoint coverage...");
    
    const coverage = {
      mobile: 0,
      tablet: 0,
      desktop: 0,
      wide: 0
    };
    
    Object.values(this.componentAnalysis).forEach(component => {
      Object.entries(component.breakpoints).forEach(([breakpoint, analysis]) => {
        if (analysis.score > 70) {
          coverage[breakpoint]++;
        }
      });
    });
    
    const totalComponents = Object.keys(this.componentAnalysis).length;
    
    console.log(`✅ Breakpoint coverage:`);
    console.log(`  Mobile: ${Math.round((coverage.mobile / totalComponents) * 100)}%`);
    console.log(`  Tablet: ${Math.round((coverage.tablet / totalComponents) * 100)}%`);
    console.log(`  Desktop: ${Math.round((coverage.desktop / totalComponents) * 100)}%`);
    console.log(`  Wide: ${Math.round((coverage.wide / totalComponents) * 100)}%`);
  }

  async checkMobileFirstApproach() {
    console.log("📱 Checking mobile-first approach...");
    
    const mobileFirstComponents = Object.values(this.componentAnalysis)
      .filter(component => component.mobileFirst.score > 80).length;
    
    const totalComponents = Object.keys(this.componentAnalysis).length;
    const mobileFirstPercentage = Math.round((mobileFirstComponents / totalComponents) * 100);
    
    console.log(`✅ Mobile-first approach: ${mobileFirstPercentage}% of components`);
  }

  async checkResponsivePatterns() {
    console.log("🎨 Checking responsive patterns...");
    
    const responsiveComponents = Object.values(this.componentAnalysis)
      .filter(component => component.patterns && component.patterns.issues && component.patterns.issues.length === 0).length;
    
    const totalComponents = Object.keys(this.componentAnalysis).length;
    const responsivePercentage = Math.round((responsiveComponents / totalComponents) * 100);
    
    console.log(`✅ Responsive patterns: ${responsivePercentage}% of components`);
  }

  generateResponsiveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(),
      components: this.componentAnalysis,
      recommendations: this.generateRecommendations(),
      nextSteps: this.generateNextSteps()
    };

    // Save report
    const reportFile = `.ai/reports/responsive-design-report-${Date.now()}.json`;
    writeFileSync(reportFile, JSON.stringify(report, null, 2));

    return report;
  }

  generateSummary() {
    const components = Object.values(this.componentAnalysis);
    const totalComponents = components.length;
    
    const avgScore = Math.round(
      components.reduce((sum, comp) => sum + comp.score, 0) / totalComponents
    );
    
    const totalIssues = components.reduce((sum, comp) => sum + comp.issues.length, 0);
    const totalWarnings = components.reduce((sum, comp) => sum + comp.warnings.length, 0);
    
    const breakpointCoverage = {
      mobile: Math.round(components.reduce((sum, comp) => sum + (comp.breakpoints.mobile.score > 70 ? 1 : 0), 0) / totalComponents * 100),
      tablet: Math.round(components.reduce((sum, comp) => sum + (comp.breakpoints.tablet.score > 70 ? 1 : 0), 0) / totalComponents * 100),
      desktop: Math.round(components.reduce((sum, comp) => sum + (comp.breakpoints.desktop.score > 70 ? 1 : 0), 0) / totalComponents * 100),
      wide: Math.round(components.reduce((sum, comp) => sum + (comp.breakpoints.wide.score > 70 ? 1 : 0), 0) / totalComponents * 100)
    };
    
    const mobileFirstPercentage = Math.round(
      components.reduce((sum, comp) => sum + (comp.mobileFirst.score > 80 ? 1 : 0), 0) / totalComponents * 100
    );
    
    return {
      totalComponents,
      averageScore: avgScore,
      totalIssues,
      totalWarnings,
      breakpointCoverage,
      mobileFirstPercentage,
      status: avgScore >= 90 ? 'excellent' : avgScore >= 75 ? 'good' : avgScore >= 60 ? 'fair' : 'needs-improvement'
    };
  }

  generateRecommendations() {
    const recommendations = [];
    const summary = this.generateSummary();
    
    if (summary.breakpointCoverage.mobile < 80) {
      recommendations.push('Improve mobile responsiveness - add sm: breakpoint classes');
    }
    
    if (summary.breakpointCoverage.tablet < 80) {
      recommendations.push('Improve tablet responsiveness - add md: breakpoint classes');
    }
    
    if (summary.breakpointCoverage.desktop < 80) {
      recommendations.push('Improve desktop responsiveness - add lg: breakpoint classes');
    }
    
    if (summary.breakpointCoverage.wide < 80) {
      recommendations.push('Improve wide screen responsiveness - add xl: and 2xl: breakpoint classes');
    }
    
    if (summary.mobileFirstPercentage < 80) {
      recommendations.push('Adopt mobile-first approach - start with mobile styles and add larger breakpoints');
    }
    
    if (summary.totalIssues > 0) {
      recommendations.push(`Fix ${summary.totalIssues} responsive design issues`);
    }
    
    return recommendations;
  }

  generateNextSteps() {
    return [
      '1. Fix mobile responsiveness issues',
      '2. Add missing breakpoint classes',
      '3. Implement mobile-first approach',
      '4. Test on actual devices',
      '5. Set up automated responsive testing',
      '6. Create responsive design documentation'
    ];
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case "validate":
        const report = await this.validateResponsiveDesign();
        this.printReport(report);
        break;
        
      case "analyze":
        await this.analyzeComponents();
        console.log("✅ Component analysis complete");
        break;
        
      default:
        console.log("📱 MastroHUB v2 Responsive Design Validator");
        console.log("\nUsage:");
        console.log("  node responsive-design-validator.mjs validate - Full responsive validation");
        console.log("  node responsive-design-validator.mjs analyze  - Analyze components only");
        break;
    }
  }

  printReport(report) {
    console.log("\n📱 RESPONSIVE DESIGN VALIDATION REPORT");
    console.log("=" .repeat(60));
    
    console.log("\n📊 SUMMARY");
    console.log(`Total Components: ${report.summary.totalComponents}`);
    console.log(`Average Score: ${report.summary.averageScore}/100`);
    console.log(`Status: ${report.summary.status.toUpperCase()}`);
    console.log(`Total Issues: ${report.summary.totalIssues}`);
    console.log(`Total Warnings: ${report.summary.totalWarnings}`);
    
    console.log("\n📱 BREAKPOINT COVERAGE");
    console.log(`Mobile: ${report.summary.breakpointCoverage.mobile}%`);
    console.log(`Tablet: ${report.summary.breakpointCoverage.tablet}%`);
    console.log(`Desktop: ${report.summary.breakpointCoverage.desktop}%`);
    console.log(`Wide: ${report.summary.breakpointCoverage.wide}%`);
    
    console.log("\n📱 MOBILE-FIRST APPROACH");
    console.log(`Components using mobile-first: ${report.summary.mobileFirstPercentage}%`);
    
    console.log("\n🧩 COMPONENT SCORES");
    Object.entries(report.components).forEach(([name, component]) => {
      console.log(`${name}: ${component.score}/100`);
      if (component.issues.length > 0) {
        console.log(`  Issues: ${component.issues.length}`);
      }
      if (component.warnings.length > 0) {
        console.log(`  Warnings: ${component.warnings.length}`);
      }
    });
    
    console.log("\n💡 RECOMMENDATIONS");
    report.recommendations.forEach(rec => console.log(`- ${rec}`));
    
    console.log("\n🚀 NEXT STEPS");
    report.nextSteps.forEach(step => console.log(step));
    
    console.log("\n" + "=" .repeat(60));
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('responsive-design-validator.mjs')) {
  const validator = new ResponsiveDesignValidator();
  validator.run().catch(error => {
    console.error("❌ Responsive validation failed:", error.message);
    process.exit(1);
  });
}

export default ResponsiveDesignValidator;
