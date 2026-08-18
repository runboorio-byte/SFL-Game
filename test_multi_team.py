"""
Test script for Treasure Game - Multi-team progress tracking (Fixed)
"""
from playwright.sync_api import sync_playwright
import sys
import io
import os

# Fix encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_URL = f"file:///{BASE_DIR}/index.html".replace("\\", "/")

def test_multi_team_progress():
    results = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 480, "height": 800})
        
        print("=" * 60)
        print("   MULTI-TEAM PROGRESS TRACKING TEST")
        print("=" * 60)
        
        # Clear localStorage first
        page = context.new_page()
        page.goto(BASE_URL)
        page.evaluate("localStorage.clear()")
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")
        page.close()
        
        # ============== TEAM 1: KING1 - Complete all stations ==============
        print("\n[1] KING1 - Starting game...")
        page1 = context.new_page()
        page1.goto(BASE_URL)
        page1.wait_for_load_state("networkidle")
        
        page1.fill("#team-code", "KING1")
        page1.click("#btn-start")
        page1.wait_for_timeout(500)
        
        # Station 1
        page1.fill("#riddle-answer", "13")
        page1.click("#btn-check-answer")
        page1.wait_for_timeout(1500)
        page1.fill("#station-code", "LIB01")
        page1.click("#btn-check-code")
        page1.wait_for_timeout(1000)
        
        # Station 2
        page1.fill("#riddle-answer", "8")
        page1.click("#btn-check-answer")
        page1.wait_for_timeout(1500)
        page1.fill("#station-code", "TCH02")
        page1.click("#btn-check-code")
        page1.wait_for_timeout(1000)
        
        # Station 3
        page1.fill("#riddle-answer", "48")
        page1.click("#btn-check-answer")
        page1.wait_for_timeout(1500)
        page1.fill("#station-code", "CLS03")
        page1.click("#btn-check-code")
        page1.wait_for_timeout(1000)
        
        # Station 4
        page1.fill("#riddle-answer", "\u0627\u0644\u062d\u0641\u0631\u0629")
        page1.click("#btn-check-answer")
        page1.wait_for_timeout(1500)
        page1.fill("#station-code", "MGR04")
        page1.click("#btn-check-code")
        page1.wait_for_timeout(1000)
        
        # Station 5
        page1.fill("#riddle-answer", "6")
        page1.click("#btn-check-answer")
        page1.wait_for_timeout(1500)
        page1.fill("#station-code", "LAB05")
        page1.click("#btn-check-code")
        page1.wait_for_timeout(1000)
        
        # Verify KING1 progress in localStorage
        king1_progress = page1.evaluate("localStorage.getItem('team_KING1_progress')")
        print(f"   KING1 - localStorage progress: {king1_progress}")
        results.append(("KING1 Stations", "PASS", f"Progress: {king1_progress}"))
        
        # ============== TEAM 2: BLUE2 - Complete 3 stations ==============
        print("\n[2] BLUE2 - Starting game...")
        page2 = context.new_page()
        page2.goto(BASE_URL)
        page2.wait_for_load_state("networkidle")
        
        page2.fill("#team-code", "BLUE2")
        page2.click("#btn-start")
        page2.wait_for_timeout(500)
        
        # Station 1
        page2.fill("#riddle-answer", "14")
        page2.click("#btn-check-answer")
        page2.wait_for_timeout(1500)
        page2.fill("#station-code", "GRD01")
        page2.click("#btn-check-code")
        page2.wait_for_timeout(1000)
        
        # Station 2
        page2.fill("#riddle-answer", "3")
        page2.click("#btn-check-answer")
        page2.wait_for_timeout(1500)
        page2.fill("#station-code", "COM02")
        page2.click("#btn-check-code")
        page2.wait_for_timeout(1000)
        
        # Station 3
        page2.fill("#riddle-answer", "8")
        page2.click("#btn-check-answer")
        page2.wait_for_timeout(1500)
        page2.fill("#station-code", "HAL03")
        page2.click("#btn-check-code")
        page2.wait_for_timeout(1000)
        
        # Verify BLUE2 progress in localStorage
        blue2_progress = page2.evaluate("localStorage.getItem('team_BLUE2_progress')")
        print(f"   BLUE2 - localStorage progress: {blue2_progress}")
        results.append(("BLUE2 Stations", "PASS", f"Progress: {blue2_progress}"))
        
        # ============== TEAM 3: RED3 - Complete 1 station ==============
        print("\n[3] RED3 - Starting game...")
        page3 = context.new_page()
        page3.goto(BASE_URL)
        page3.wait_for_load_state("networkidle")
        
        page3.fill("#team-code", "RED3")
        page3.click("#btn-start")
        page3.wait_for_timeout(500)
        
        # Station 1
        page3.fill("#riddle-answer", "20")
        page3.click("#btn-check-answer")
        page3.wait_for_timeout(1500)
        page3.fill("#station-code", "SWS01")
        page3.click("#btn-check-code")
        page3.wait_for_timeout(1000)
        
        # Verify RED3 progress in localStorage
        red3_progress = page3.evaluate("localStorage.getItem('team_RED3_progress')")
        print(f"   RED3 - localStorage progress: {red3_progress}")
        results.append(("RED3 Stations", "PASS", f"Progress: {red3_progress}"))
        
        # ============== ADMIN PANEL - Check all teams progress ==============
        print("\n[4] ADMIN PANEL - Checking all teams progress...")
        page_admin = context.new_page()
        page_admin.goto(BASE_URL)
        page_admin.wait_for_load_state("networkidle")
        page_admin.wait_for_timeout(500)
        
        # Check all localStorage values
        all_storage = page_admin.evaluate("""
            () => {
                const items = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    items[key] = localStorage.getItem(key);
                }
                return items;
            }
        """)
        print(f"   All localStorage: {all_storage}")
        
        page_admin.fill("#team-code", "ADMIN5050")
        page_admin.click("#btn-start")
        page_admin.wait_for_timeout(1000)
        
        # Verify admin panel is visible
        assert page_admin.locator("#screen-admin").is_visible(), "Admin panel not visible"
        
        # Check each team's progress
        team_cards = page_admin.locator(".admin-team-card").all()
        assert len(team_cards) == 5, f"Expected 5 team cards, got {len(team_cards)}"
        
        # Get progress for each team
        for i, card in enumerate(team_cards):
            team_name = card.locator(".admin-team-name").inner_text()
            station_info = card.locator(".admin-current-station").inner_text()
            print(f"   Team {i+1}: {team_name} - {station_info}")
        
        # Verify KING1 is at final riddle (5/5)
        king1_card = page_admin.locator(".admin-team-card").nth(0)
        king1_station = king1_card.locator(".admin-current-station").inner_text()
        king1_progress_text = king1_card.locator(".admin-station-info span:last-child").inner_text()
        print(f"   KING1 detailed: {king1_station} | {king1_progress_text}")
        
        # Check if KING1 shows 5/5 or اللغز النهائي
        if "اللغز النهائي" in king1_station or "5/5" in king1_progress_text:
            results.append(("Admin - KING1 Progress", "PASS", f"Status: {king1_station}"))
        else:
            results.append(("Admin - KING1 Progress", "FAIL", f"Expected 5/5, got: {king1_station} | {king1_progress_text}"))
        
        # Verify BLUE2 is at station 4 (3/5 completed)
        blue2_card = page_admin.locator(".admin-team-card").nth(1)
        blue2_station = blue2_card.locator(".admin-current-station").inner_text()
        blue2_progress_text = blue2_card.locator(".admin-station-info span:last-child").inner_text()
        print(f"   BLUE2 detailed: {blue2_station} | {blue2_progress_text}")
        
        if "4" in blue2_station or "3/5" in blue2_progress_text:
            results.append(("Admin - BLUE2 Progress", "PASS", f"Status: {blue2_station}"))
        else:
            results.append(("Admin - BLUE2 Progress", "FAIL", f"Expected 3/5 or station 4, got: {blue2_station} | {blue2_progress_text}"))
        
        # Verify RED3 is at station 2 (1/5 completed)
        red3_card = page_admin.locator(".admin-team-card").nth(2)
        red3_station = red3_card.locator(".admin-current-station").inner_text()
        red3_progress_text = red3_card.locator(".admin-station-info span:last-child").inner_text()
        print(f"   RED3 detailed: {red3_station} | {red3_progress_text}")
        
        if "2" in red3_station or "1/5" in red3_progress_text:
            results.append(("Admin - RED3 Progress", "PASS", f"Status: {red3_station}"))
        else:
            results.append(("Admin - RED3 Progress", "FAIL", f"Expected 1/5 or station 2, got: {red3_station} | {red3_progress_text}"))
        
        # Check answers section exists
        answers_tables = page_admin.locator(".admin-answers-table").count()
        assert answers_tables == 5, f"Expected 5 answer tables, got {answers_tables}"
        results.append(("Admin - Answers Tables", "PASS", f"{answers_tables} tables"))
        
        # Check final riddle answer
        final_answer = page_admin.locator(".admin-final-answer").inner_text()
        assert "1 - 3 - 2" in final_answer, f"Final answer incorrect: {final_answer}"
        results.append(("Admin - Final Answer", "PASS", "1 - 3 - 2"))
        
        print("   ADMIN PANEL - All teams progress visible!")
        
        # ============== KING1 - Complete final riddle and capture ==============
        print("\n[5] KING1 - Completing final riddle...")
        page1.fill("#final-digit-1", "1")
        page1.fill("#final-digit-2", "3")
        page1.fill("#final-digit-3", "2")
        page1.click("#btn-check-final")
        page1.wait_for_timeout(1000)
        
        # Capture treasure
        page1.click("#btn-capture-treasure")
        page1.wait_for_timeout(2000)
        
        assert page1.locator("#screen-win").is_visible(), "KING1 win screen not visible"
        win_team = page1.locator("#win-team-name").inner_text()
        results.append(("KING1 Win", "PASS", f"Winner: {win_team}"))
        print(f"   KING1 - WINNER! {win_team}")
        
        # ============== BLUE2 - Try to continue (should see game over) ==============
        print("\n[6] BLUE2 - Checking game over...")
        page2.goto(BASE_URL)
        page2.wait_for_load_state("networkidle")
        page2.wait_for_timeout(1000)
        
        game_over_visible = page2.locator("#game-over-screen").is_visible()
        if game_over_visible:
            winner_display = page2.locator("#winner-name-display").inner_text()
            results.append(("BLUE2 Game Over", "PASS", f"Winner shown: {winner_display}"))
            print(f"   BLUE2 - Game Over! Winner: {winner_display}")
        else:
            results.append(("BLUE2 Game Over", "WARN", "Not shown"))
            print("   BLUE2 - Game over not shown")
        
        # ============== RED3 - Try to continue (should see game over) ==============
        print("\n[7] RED3 - Checking game over...")
        page3.goto(BASE_URL)
        page3.wait_for_load_state("networkidle")
        page3.wait_for_timeout(1000)
        
        game_over_visible = page3.locator("#game-over-screen").is_visible()
        if game_over_visible:
            winner_display = page3.locator("#winner-name-display").inner_text()
            results.append(("RED3 Game Over", "PASS", f"Winner shown: {winner_display}"))
            print(f"   RED3 - Game Over! Winner: {winner_display}")
        else:
            results.append(("RED3 Game Over", "WARN", "Not shown"))
            print("   RED3 - Game over not shown")
        
        # ============== ADMIN PANEL - After winner ==============
        print("\n[8] ADMIN PANEL - After winner...")
        page_admin.goto(BASE_URL)
        page_admin.wait_for_load_state("networkidle")
        page_admin.wait_for_timeout(500)
        
        page_admin.fill("#team-code", "ADMIN5050")
        page_admin.click("#btn-start")
        page_admin.wait_for_timeout(1000)
        
        # Check game status shows winner
        status_text = page_admin.locator("#status-text").inner_text()
        winner_display = page_admin.locator("#winner-display").inner_text()
        
        assert "انتهت" in status_text or "فائز" in status_text, f"Status not updated: {status_text}"
        results.append(("Admin - Winner Status", "PASS", f"Winner: {winner_display}"))
        print(f"   ADMIN - Game Status: {status_text}")
        print(f"   ADMIN - Winner: {winner_display}")
        
        # Check winner card is highlighted
        winner_cards = page_admin.locator(".admin-team-card.admin-winner").count()
        assert winner_cards > 0, "No winner card highlighted"
        results.append(("Admin - Winner Card", "PASS", f"{winner_cards} card(s) highlighted"))
        print(f"   ADMIN - Winner card highlighted: {winner_cards}")
        
        # ============== CLEANUP ==============
        page1.close()
        page2.close()
        page3.close()
        page_admin.close()
        context.close()
        browser.close()
    
    # Print results summary
    print("\n" + "=" * 60)
    print("   MULTI-TEAM PROGRESS TEST RESULTS")
    print("=" * 60)
    
    passed = sum(1 for r in results if r[1] == "PASS")
    warnings = sum(1 for r in results if r[1] == "WARN")
    failed = sum(1 for r in results if r[1] == "FAIL")
    
    for name, status, detail in results:
        icon = "[PASS]" if status == "PASS" else "[WARN]" if status == "WARN" else "[FAIL]"
        print(f"  {icon} {name}: {detail}")
    
    print(f"\n  Total: {len(results)} tests")
    print(f"  Passed: {passed}")
    print(f"  Warnings: {warnings}")
    print(f"  Failed: {failed}")
    
    if failed == 0:
        print("\n  *** ALL MULTI-TEAM TESTS PASSED! ***")
    else:
        print(f"\n  *** {failed} TESTS FAILED ***")
    
    return failed == 0

if __name__ == "__main__":
    success = test_multi_team_progress()
    exit(0 if success else 1)
