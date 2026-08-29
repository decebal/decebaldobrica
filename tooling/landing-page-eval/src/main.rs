use std::env;
use std::fs;
use std::path::{Path, PathBuf};

struct Check {
    name: &'static str,
    points: u32,
    passes: bool,
}

fn read(root: &Path, path: &str) -> String {
    let absolute = root.join(path);
    fs::read_to_string(&absolute)
        .unwrap_or_else(|error| panic!("failed to read {}: {error}", absolute.display()))
}

fn contains_ci(haystack: &str, needle: &str) -> bool {
    haystack.to_lowercase().contains(&needle.to_lowercase())
}

fn count_ci(haystack: &str, needle: &str) -> usize {
    haystack
        .to_lowercase()
        .match_indices(&needle.to_lowercase())
        .count()
}

fn quoted_value_after(source: &str, marker: &str) -> Option<String> {
    let tail = source.split_once(marker)?.1.trim_start();
    let quote = tail.chars().next()?;
    if quote != '\'' && quote != '"' {
        return None;
    }
    let value = &tail[quote.len_utf8()..];
    let end = value.find(quote)?;
    Some(value[..end].to_owned())
}

fn json_string(source: &str, key: &str) -> Option<String> {
    let marker = format!("\"{key}\":");
    quoted_value_after(source, &marker)
}

fn main() {
    let root = env::args_os()
        .nth(1)
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("."));

    let hero = read(&root, "apps/web/src/components/HeroSection.tsx");
    let services = read(&root, "apps/web/src/components/ServicesSection.tsx");
    let navbar = read(&root, "apps/web/src/components/Navbar.tsx");
    let homepage = read(&root, "apps/web/src/app/page.tsx");
    let config = read(&root, "apps/web/src/config/personal.json");
    let schema = read(&root, "apps/web/src/lib/structuredData.ts");
    let work = read(&root, "apps/web/src/components/WorkSection.tsx");
    let tests = read(&root, "apps/web/tests/e2e/homepage.spec.ts");

    let title = quoted_value_after(&homepage, "title:").unwrap_or_default();
    let description = json_string(&config, "metaDescription").unwrap_or_default();
    let combined_offer = format!("{hero}\n{services}");
    let all_home = format!("{hero}\n{services}\n{homepage}");

    let forbidden_ir35_claim = [
        "guaranteed outside ir35",
        "ir35 compliant",
        "always outside ir35",
        "automatically outside ir35",
    ]
    .iter()
    .any(|claim| contains_ci(&combined_offer, claim));

    let checks = vec![
        Check {
            name: "homepage title uses 30-60 characters",
            points: 4,
            passes: (30..=60).contains(&title.chars().count()),
        },
        Check {
            name: "homepage title names London and core engineering intent",
            points: 5,
            passes: contains_ci(&title, "London")
                && (contains_ci(&title, "Rust") || contains_ci(&title, "AI"))
                && contains_ci(&title, "Engineer"),
        },
        Check {
            name: "meta description uses 120-160 characters",
            points: 4,
            passes: (120..=160).contains(&description.chars().count()),
        },
        Check {
            name: "meta description covers both target engagement intents",
            points: 5,
            passes: contains_ci(&description, "London")
                && contains_ci(&description, "outside-IR35")
                && contains_ci(&description, "founding engineer"),
        },
        Check {
            name: "homepage keeps canonical metadata",
            points: 2,
            passes: homepage.contains("alternates: { canonical: '/' }"),
        },
        Check {
            name: "homepage exposes one H1",
            points: 3,
            passes: count_ci(&all_home, "<h1") == 1,
        },
        Check {
            name: "hero states London availability",
            points: 4,
            passes: contains_ci(&hero, "London"),
        },
        Check {
            name: "hero names outside-IR35 contract intent",
            points: 5,
            passes: contains_ci(&hero, "outside-IR35") && contains_ci(&hero, "contract"),
        },
        Check {
            name: "hero names founding engineer intent",
            points: 5,
            passes: contains_ci(&hero, "founding engineer"),
        },
        Check {
            name: "hero supports claims with concrete experience",
            points: 4,
            passes: hero.contains("15+") && hero.contains("1M+"),
        },
        Check {
            name: "hero has direct contact CTA",
            points: 3,
            passes: hero.contains("href=\"/contact") || hero.contains("href={'/contact"),
        },
        Check {
            name: "hero exposes downloadable CV",
            points: 3,
            passes: contains_ci(&hero, "/resume/") && contains_ci(&hero, "CV"),
        },
        Check {
            name: "hero links proof before pitch",
            points: 2,
            passes: hero.contains("href=\"/work\"") && contains_ci(&hero, "case"),
        },
        Check {
            name: "services and method are one homepage section",
            points: 6,
            passes: !homepage.contains("import HowIWorkSection")
                && !homepage.contains("<HowIWorkSection")
                && homepage.contains("<ServicesSection"),
        },
        Check {
            name: "merged section uses buyer-readable heading",
            points: 4,
            passes: contains_ci(&services, "Ways to work together"),
        },
        Check {
            name: "merged section retains services anchor",
            points: 2,
            passes: services.contains("id=\"services\""),
        },
        Check {
            name: "merged section has exactly two primary engagement paths",
            points: 6,
            passes: count_ci(&services, "data-testid=\"engagement-path\"") == 2,
        },
        Check {
            name: "merged section distinguishes contract and founding paths",
            points: 4,
            passes: contains_ci(&services, "outside-IR35")
                && contains_ci(&services, "founding engineer"),
        },
        Check {
            name: "merged section explains evidence-led delivery",
            points: 5,
            passes: ["Discover", "Specify", "Build", "Verify", "Learn"]
                .iter()
                .all(|stage| services.contains(stage)),
        },
        Check {
            name: "merged section preserves public workflow evidence",
            points: 3,
            passes: services.contains("decebal-claude-skills")
                && services.contains("decebal-codex-skills"),
        },
        Check {
            name: "merged section links full services detail",
            points: 2,
            passes: services.contains("href=\"/services\"") && contains_ci(&services, "services"),
        },
        Check {
            name: "generic legacy service copy is gone",
            points: 3,
            passes: !contains_ci(&services, "How I Can Help")
                && !contains_ci(&services, "accelerate your portfolio velocity"),
        },
        Check {
            name: "IR35 wording avoids status guarantees",
            points: 5,
            passes: !forbidden_ir35_claim
                && contains_ci(&combined_offer, "subject to")
                && contains_ci(&combined_offer, "working practices"),
        },
        Check {
            name: "navigation offers one merged path",
            points: 4,
            passes: !contains_ci(&navbar, "How I Work")
                && navbar.contains("href=\"/#services\"")
                && contains_ci(&navbar, "Work with me"),
        },
        Check {
            name: "proof precedes offer on homepage",
            points: 3,
            passes: homepage.find("<WorkSection").unwrap_or(usize::MAX)
                < homepage.find("<ServicesSection").unwrap_or(0),
        },
        Check {
            name: "person schema covers target expertise and London",
            points: 3,
            passes: contains_ci(&schema, "founding engineer") && contains_ci(&schema, "London"),
        },
        Check {
            name: "evidence alignment has structural regression coverage",
            points: 3,
            passes: work.contains("data-testid=\"work-intro\"")
                && work.contains("grid-rows-subgrid")
                && tests.contains("shared desktop axes"),
        },
    ];

    let score: u32 = checks
        .iter()
        .filter(|check| check.passes)
        .map(|check| check.points)
        .sum();
    let maximum: u32 = checks.iter().map(|check| check.points).sum();

    for check in &checks {
        eprintln!(
            "{} {:>2} {}",
            if check.passes { "PASS" } else { "FAIL" },
            check.points,
            check.name
        );
    }
    eprintln!("raw={score}/{maximum}");
    println!("score={:.4}", f64::from(score) * 100.0 / f64::from(maximum));
}
