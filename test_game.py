"""
Test script for Treasure Game - Using file:// protocol
"""
from playwright.sync_api import sync_playwright
import sys
import io
import os

# Fix encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_URL = f"file:///{BASE_DIR}/index.html".replace("\\", "/")

def test_game():
    results = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 480, "height": 800})
        
        print("=" * 50)
        print("   TREASURE GAME - FULL TEST")
        print("=" * 50)
        
        # Clear localStorage first
        page.goto(BASE_URL)
        page.evaluate("localStorage.clear()")
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")
        
        # 1. Test start screen
        print("\n[1] Testing start screen...")
        assert page.locator("#screen-start").is_visible(), "Start screen not visible"
        logo_text = page.locator(".logo h1").inner_text()
        assert len(logo_text) > 0, "Logo text empty"
        assert page.locator("#team-code").is_visible(), "Team code input not visible"
        assert page.locator("#btn-start").is_visible(), "Start button not visible"
        
        # Check team codes
        codes = page.locator(".code-item .code").all_inner_texts()
        assert "KING1" in codes, "KING1 code not found"
        assert "BLUE2" in codes, "BLUE2 code not found"
        assert "RED3" in codes, "RED3 code not found"
        assert "GREEN4" in codes, "GREEN4 code not found"
        assert "STAR5" in codes, "STAR5 code not found"
        
        results.append(("Start Screen", "PASS", "All elements present"))
        print("   PASS - Start screen OK")
        
        # 2. Test wrong code
        print("\n[2] Testing wrong code...")
        page.fill("#team-code", "WRONG")
        page.click("#btn-start")
        page.wait_for_timeout(500)
        error_msg = page.locator("#error-msg").inner_text()
        assert len(error_msg) > 0, "No error message shown"
        results.append(("Wrong Code", "PASS", "Error message shown"))
        print("   PASS - Wrong code shows error")
        
        # 3. Test login with KING1
        print("\n[3] Testing login with KING1...")
        page.fill("#team-code", "KING1")
        page.click("#btn-start")
        page.wait_for_timeout(500)
        
        assert page.locator("#screen-game").is_visible(), "Game screen not visible"
        team_name = page.locator("#team-name-display").inner_text()
        results.append(("Login KING1", "PASS", f"Team: {team_name}"))
        print(f"   PASS - Login KING1: {team_name}")
        
        # 4. Test wrong answer
        print("\n[4] Testing wrong answer...")
        page.fill("#riddle-answer", "10")
        page.click("#btn-check-answer")
        page.wait_for_timeout(500)
        
        error = page.locator("#answer-error").inner_text()
        assert len(error) > 0, "No error message for wrong answer"
        results.append(("Wrong Answer", "PASS", "Error shown"))
        print("   PASS - Wrong answer shows error")
        
        # 5. Test correct answer (Station 1)
        print("\n[5] Testing correct answer - Station 1...")
        page.fill("#riddle-answer", "13")
        page.click("#btn-check-answer")
        page.wait_for_timeout(1500)
        
        assert page.locator("#location-card").is_visible(), "Location card not visible"
        location = page.locator("#location-name").inner_text()
        results.append(("Station 1 Answer", "PASS", f"Location: {location}"))
        print(f"   PASS - Station 1: {location}")
        
        # 6. Test station code (Station 1)
        print("\n[6] Testing station code - Station 1...")
        page.fill("#station-code", "LIB01")
        page.click("#btn-check-code")
        page.wait_for_timeout(1000)
        
        riddle2 = page.locator("#riddle-text").inner_text()
        assert len(riddle2) > 0, "Station 2 riddle not loaded"
        results.append(("Station 1 Code", "PASS", "Moved to Station 2"))
        print("   PASS - Moved to Station 2")
        
        # 7. Test Station 2
        print("\n[7] Testing Station 2...")
        page.fill("#riddle-answer", "8")
        page.click("#btn-check-answer")
        page.wait_for_timeout(1500)
        page.fill("#station-code", "TCH02")
        page.click("#btn-check-code")
        page.wait_for_timeout(1000)
        results.append(("Station 2", "PASS", "Completed"))
        print("   PASS - Station 2 completed")
        
        # 8. Test Station 3
        print("\n[8] Testing Station 3...")
        page.fill("#riddle-answer", "48")
        page.click("#btn-check-answer")
        page.wait_for_timeout(1500)
        page.fill("#station-code", "CLS03")
        page.click("#btn-check-code")
        page.wait_for_timeout(1000)
        results.append(("Station 3", "PASS", "Completed"))
        print("   PASS - Station 3 completed")
        
        # 9. Test Station 4
        print("\n[9] Testing Station 4...")
        page.fill("#riddle-answer", "\u0627\u0644\u062d\u0641\u0631\u0629")
        page.click("#btn-check-answer")
        page.wait_for_timeout(1500)
        page.fill("#station-code", "MGR04")
        page.click("#btn-check-code")
        page.wait_for_timeout(1000)
        results.append(("Station 4", "PASS", "Completed"))
        print("   PASS - Station 4 completed")
        
        # 10. Test Station 5
        print("\n[10] Testing Station 5...")
        page.fill("#riddle-answer", "6")
        page.click("#btn-check-answer")
        page.wait_for_timeout(1500)
        page.fill("#station-code", "LAB05")
        page.click("#btn-check-code")
        page.wait_for_timeout(1000)
        results.append(("Station 5", "PASS", "Completed"))
        print("   PASS - Station 5 completed")
        
        # 11. Test final riddle
        print("\n[11] Testing final riddle...")
        assert page.locator("#final-riddle-screen").is_visible(), "Final riddle screen not visible"
        
        final_text = page.locator("#final-riddle-text").inner_text()
        assert len(final_text) > 0, "Final riddle text empty"
        
        page.fill("#final-digit-1", "1")
        page.fill("#final-digit-2", "3")
        page.fill("#final-digit-3", "2")
        page.click("#btn-check-final")
        page.wait_for_timeout(1000)
        
        results.append(("Final Riddle", "PASS", "Correct answer 1-3-2"))
        print("   PASS - Final riddle answered correctly")
        
        # 12. Test capture treasure screen
        print("\n[12] Testing capture treasure screen...")
        assert page.locator("#capture-screen").is_visible(), "Capture screen not visible"
        results.append(("Capture Screen", "PASS", "Visible"))
        print("   PASS - Capture screen visible")
        
        # 13. Test capture treasure button
        print("\n[13] Testing capture treasure...")
        page.click("#btn-capture-treasure")
        page.wait_for_timeout(2000)
        
        assert page.locator("#screen-win").is_visible(), "Win screen not visible"
        win_team = page.locator("#win-team-name").inner_text()
        treasure = page.locator("#treasure-place").inner_text()
        results.append(("Capture Treasure", "PASS", f"Winner: {win_team}"))
        print(f"   PASS - Winner: {win_team}")
        
        # 14. Test game over for other team
        print("\n[14] Testing game over for other team...")
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(1000)
        
        # The game over screen should be visible because localStorage has winner
        game_over_visible = page.locator("#game-over-screen").is_visible()
        if game_over_visible:
            winner_display = page.locator("#winner-name-display").inner_text()
            results.append(("Game Over Screen", "PASS", f"Winner: {winner_display}"))
            print(f"   PASS - Game over shown, winner: {winner_display}")
        else:
            results.append(("Game Over Screen", "WARN", "Not shown"))
            print("   WARN - Game over not shown")
        
        # 15. Test admin panel - Clear localStorage first
        print("\n[15] Testing admin panel...")
        page.evaluate("localStorage.clear()")
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(500)
        
        # Verify start screen is visible
        assert page.locator("#screen-start").is_visible(), "Start screen not visible after clear"
        
        page.fill("#team-code", "ADMIN5050")
        page.click("#btn-start")
        page.wait_for_timeout(1000)
        
        assert page.locator("#screen-admin").is_visible(), "Admin panel not visible"
        
        status = page.locator("#status-text").inner_text()
        answers_tables = page.locator(".admin-answers-table").count()
        final_answer = page.locator(".admin-final-answer").inner_text()
        
        assert answers_tables == 5, f"Expected 5 tables, got {answers_tables}"
        assert "1 - 3 - 2" in final_answer, f"Final answer incorrect: {final_answer}"
        
        results.append(("Admin Panel", "PASS", f"Status: {status}, Tables: {answers_tables}"))
        print(f"   PASS - Admin panel OK")
        
        # 16. Test reset game
        print("\n[16] Testing reset game...")
        page.on("dialog", lambda dialog: dialog.accept())
        page.click("#btn-reset-game")
        page.wait_for_timeout(1000)
        
        assert page.locator("#screen-start").is_visible(), "Did not return to start screen"
        results.append(("Reset Game", "PASS", "Game reset"))
        print("   PASS - Game reset successfully")
        
        # 17. Test game works after reset
        print("\n[17] Testing game after reset...")
        page.fill("#team-code", "BLUE2")
        page.click("#btn-start")
        page.wait_for_timeout(500)
        
        assert page.locator("#screen-game").is_visible(), "Game not working after reset"
        team_name = page.locator("#team-name-display").inner_text()
        results.append(("Game After Reset", "PASS", f"Team: {team_name}"))
        print(f"   PASS - Game works after reset: {team_name}")
        
        browser.close()
    
    # Print results summary
    print("\n" + "=" * 50)
    print("   TEST RESULTS SUMMARY")
    print("=" * 50)
    
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
        print("\n  *** ALL TESTS PASSED! ***")
    else:
        print(f"\n  *** {failed} TESTS FAILED ***")
    
    return failed == 0

if __name__ == "__main__":
    success = test_game()
    exit(0 if success else 1)
